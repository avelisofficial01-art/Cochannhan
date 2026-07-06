import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { fetchWithAuth } from '../api/client.js';

interface QuestObjective {
  type: string;
  target: string;
  count: number;
  description?: string;
}

interface QuestTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  objectives: QuestObjective[] | string;
  flagRequired: string | null;
}

interface PlayerQuest {
  id: string;
  questId: string;
  status: string;
  objectivesProgress: Array<{ index: number; current: number; target: number }>;
}

export const QuestTracker: React.FC = () => {
  const { activeQuests, setActiveQuests } = useGameStore();
  const [questTemplates, setQuestTemplates] = useState<QuestTemplate[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchActiveQuests = async () => {
      try {
        console.log('[QuestTracker] Fetching active quests from /api/quest/player/active...');
        const res = await fetchWithAuth('/api/quest/player/active');
        const json = await res.json();
        console.log('[QuestTracker] Received active quests response:', json);
        if (json.success && json.data) {
          setActiveQuests(json.data as unknown[]);
        } else {
          console.warn('[QuestTracker] Active quests fetch unsuccessful or no data:', json);
        }
      } catch (err) {
        console.error('[QuestTracker] fetchActiveQuests error:', err);
      }
    };

    const fetchQuestTemplates = async () => {
      try {
        console.log('[QuestTracker] Fetching quest templates from /api/quest...');
        const res = await fetchWithAuth('/api/quest');
        const json = await res.json();
        console.log('[QuestTracker] Received quest templates response:', json);
        if (json.success && json.data) {
          setQuestTemplates(json.data as QuestTemplate[]);
        } else {
          console.warn('[QuestTracker] Templates fetch unsuccessful or no data:', json);
        }
      } catch (err) {
        console.error('[QuestTracker] fetchQuestTemplates error:', err);
      }
    };

    void fetchActiveQuests();
    void fetchQuestTemplates();

    // Sockets update active quests in real-time. Use a slow fallback poll (30s) to minimize traffic.
    const interval = setInterval(() => {
      void fetchActiveQuests();
    }, 30000);
    return () => clearInterval(interval);
  }, [setActiveQuests]);

  const handleCompleteQuest = async (questId: string): Promise<void> => {
    try {
      const res = await fetchWithAuth('/api/quest/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });
      const data = await res.json();
      if (data.success) {
        const activeRes = await fetchWithAuth('/api/quest/player/active');
        const activeJson = await activeRes.json();
        if (activeJson.success && activeJson.data) {
          setActiveQuests(activeJson.data as unknown[]);
        }
      }
    } catch {
      // Silent catch
    }
  };

  const activePlayerQuests = (activeQuests as PlayerQuest[]).filter(q => q.status === 'active');

  if (!activePlayerQuests || activePlayerQuests.length === 0) {
    return (
      <div style={styles.trackerContainer}>
        <div
          style={{ ...styles.header, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span>📋 Nhiệm Vụ</span>
          <span style={{ fontSize: '10px', color: '#888' }}>{isCollapsed ? '[+]' : '[-]'}</span>
        </div>
        {!isCollapsed && (
          <div style={styles.noQuest}>Chưa nhận nhiệm vụ nào. Hãy trò chuyện với Trưởng Làng.</div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.trackerContainer}>
      <div
        style={{ ...styles.header, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>📋 Nhiệm Vụ Đang Làm</span>
        <span style={{ fontSize: '10px', color: '#888' }}>{isCollapsed ? '[+]' : '[-]'}</span>
      </div>
      {!isCollapsed && activePlayerQuests.map((pq) => {
        const template = questTemplates.find((t) => t.id === pq.questId);
        if (!template) return null;

        const objectives = template.objectives
          ? typeof template.objectives === 'string'
            ? (JSON.parse(template.objectives) as QuestObjective[])
            : (template.objectives as QuestObjective[])
          : [];

        const allDone = objectives.length > 0 && objectives.every((obj, idx) => {
          const progress = pq.objectivesProgress?.[idx] || { current: 0 };
          return progress.current >= obj.count;
        });

        return (
          <div key={pq.id} style={styles.questItem}>
            <div style={styles.questName}>
              {template.name}{' '}
              <span style={{ fontSize: '10px', color: '#ffaa00' }}>
                ({template.type === 'main' ? 'Chính' : 'Phụ'})
              </span>
            </div>
            <div style={styles.questDesc}>
              {template.description}
            </div>
            
            <div style={styles.objectivesList}>
              {objectives.map((obj, idx: number) => {
                const progress = pq.objectivesProgress?.[idx] || { current: 0 };
                const isComplete = progress.current >= obj.count;
                
                let objectiveLabel = '';
                if (obj.type === 'kill') {
                  objectiveLabel = `Tiêu diệt ${obj.target}`;
                } else if (obj.type === 'talk') {
                  objectiveLabel = `Trò chuyện với ${obj.target}`;
                } else if (obj.type === 'reach') {
                  objectiveLabel = `Đi đến ${obj.target}`;
                } else if (obj.type === 'collect') {
                  objectiveLabel = `Thu thập ${obj.target}`;
                } else {
                  objectiveLabel = obj.description || `Mục tiêu ${idx + 1}`;
                }

                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.objectiveItem,
                      color: isComplete ? '#00ff88' : '#e0e0e0',
                      textDecoration: isComplete ? 'line-through' : 'none',
                    }}
                  >
                    • {objectiveLabel}: {progress.current} / {obj.count}
                  </div>
                );
              })}
            </div>

            {allDone && (
              <button
                onClick={() => handleCompleteQuest(pq.questId)}
                style={styles.claimButton}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f1c40f';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d4af37';
                }}
              >
                Nhận Thưởng (Hoàn Thành)
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  trackerContainer: {
    position: 'absolute',
    top: '80px',
    right: '20px',
    width: '240px',
    background: 'rgba(15, 15, 25, 0.8)',
    border: '1.5px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 1000,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  header: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#d4af37',
    borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
    paddingBottom: '6px',
    marginBottom: '8px',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  noQuest: {
    fontSize: '12px',
    color: '#a0a0a0',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  questItem: {
    marginBottom: '12px',
    textAlign: 'left',
  },
  questName: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '3px',
  },
  questDesc: {
    fontSize: '11px',
    color: '#b0b0b0',
    lineHeight: '1.3',
    marginBottom: '6px',
  },
  objectivesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    paddingLeft: '4px',
  },
  objectiveItem: {
    fontSize: '11px',
    lineHeight: '1.2',
  },
  claimButton: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '11px',
    backgroundColor: '#d4af37',
    border: 'none',
    borderRadius: '4px',
    color: '#0f0f19',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '6px',
    transition: 'background-color 0.2s',
  },
};
