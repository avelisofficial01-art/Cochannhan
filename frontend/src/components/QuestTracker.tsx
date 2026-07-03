import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

interface QuestObjective {
  type: string;
  target: string;
  count: number;
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

  useEffect(() => {
    const fetchActiveQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/quest/player/active', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setActiveQuests(json.data as unknown[]);
        }
      } catch {
        // Silent catch
      }
    };

    const fetchQuestTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/quest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setQuestTemplates(json.data as QuestTemplate[]);
        }
      } catch {
        // Silent catch
      }
    };

    void fetchActiveQuests();
    void fetchQuestTemplates();

    const interval = setInterval(() => {
      void fetchActiveQuests();
    }, 4000);
    return () => clearInterval(interval);
  }, [setActiveQuests]);

  const activePlayerQuests = activeQuests as PlayerQuest[];

  if (!activePlayerQuests || activePlayerQuests.length === 0) {
    return (
      <div style={styles.trackerContainer}>
        <div style={styles.header}>Nhiệm Vụ</div>
        <div style={styles.noQuest}>Chưa nhận nhiệm vụ nào. Hãy trò chuyện với Trưởng Làng.</div>
      </div>
    );
  }

  return (
    <div style={styles.trackerContainer}>
      <div style={styles.header}>Nhiệm Vụ Đang Làm</div>
      {activePlayerQuests.map((pq) => {
        const template = questTemplates.find((t) => t.id === pq.questId);
        if (!template) return null;

        const objectives = template.objectives
          ? typeof template.objectives === 'string'
            ? (JSON.parse(template.objectives) as QuestObjective[])
            : (template.objectives as QuestObjective[])
          : [];

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
                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.objectiveItem,
                      color: isComplete ? '#00ff88' : '#e0e0e0',
                      textDecoration: isComplete ? 'line-through' : 'none',
                    }}
                  >
                    • {obj.type === 'kill' ? 'Tiêu diệt' : 'Thu thập'} {obj.target}: {progress.current} / {obj.count}
                  </div>
                );
              })}
            </div>
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
};
