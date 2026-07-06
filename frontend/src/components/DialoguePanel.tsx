import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { fetchWithAuth } from '../api/client.js';

interface DialogueChoice {
  text: string;
  next_dialogue_ref: string;
  next_dialogue_id?: string;
}

interface DialogueNode {
  id: string;
  orderIndex: number;
  text: string;
  speaker: string;
  choices: DialogueChoice[] | string | null;
  conditionFlag?: string | null;
  setFlag?: string | null;
}

export const DialoguePanel: React.FC = () => {
  const { activeNpc, isDialogueOpen, closeDialogue, setActiveQuests, toggleShop } = useGameStore();
  const [dialogues, setDialogues] = useState<DialogueNode[]>([]);
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDialogueOpen || !activeNpc) {
      setDialogues([]);
      setCurrentNode(null);
      return;
    }

    const fetchDialogues = async () => {
      setLoading(true);
      try {
        // 1. Fetch active story flags
        const flagsRes = await fetchWithAuth('/api/story/flags');
        const flagsJson = await flagsRes.json();
        const activeFlags = new Set<string>();
        if (flagsJson.success && flagsJson.data) {
          flagsJson.data.forEach((f: { flagKey: string; flagValue: string }) => {
            if (f.flagValue === 'true') {
              activeFlags.add(f.flagKey);
            }
          });
        }

        // 2. Fetch dialogues for current NPC
        const res = await fetchWithAuth(`/api/npc/${activeNpc.id}/dialogues`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const fetchedNodes = json.data as DialogueNode[];
          setDialogues(fetchedNodes);

          // 3. Determine the correct start node based on NPC name and story flags
          let startNode: DialogueNode | undefined;

          if (activeNpc.name === 'Trưởng làng') {
            if (activeFlags.has('ch1_wolves_hunted') && !activeFlags.has('ch1_sent_to_elder')) {
              startNode = fetchedNodes.find(d => d.id === 'dlg_village_chief_thanks' || d.orderIndex === 6);
            } else if (activeFlags.has('ch1_sent_to_elder')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Hãy đi tìm gặp Trưởng lão ở phía Bắc làng để nghe về truyền thừa Cổ Đạo.',
                speaker: 'Trưởng làng',
                choices: null,
                setFlag: 'ch1_sent_to_elder',
              };
            } else if (activeFlags.has('ch1_intro_done')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Hãy tiến sang Đồng Cỏ Hoang phía Đông và tiêu diệt 3 con Sói Tuyết để trừ hại cho dân làng.',
                speaker: 'Trưởng làng',
                choices: null,
                setFlag: 'ch1_intro_done',
              };
            } else {
              startNode = fetchedNodes.find(d => d.orderIndex === 0);
            }
          } else if (activeNpc.name === 'Trưởng lão') {
            if (activeFlags.has('ch1_sent_to_blacksmith')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Hãy đến gặp Thợ rèn để chuẩn bị vũ khí lên Đỉnh Băng Phong.',
                speaker: 'Trưởng lão',
                choices: null,
                setFlag: 'ch1_sent_to_blacksmith',
              };
            } else if (activeFlags.has('ch1_sent_to_elder')) {
              startNode = fetchedNodes.find(d => d.orderIndex === 0);
            }
          } else if (activeNpc.name === 'Thợ rèn') {
            if (activeFlags.has('ch1_got_weapon')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Kiếm Băng Hàn đã trao cho ngươi. Hãy mau tiến vào Rừng Tuyết gia cố phong ấn.',
                speaker: 'Thợ rèn',
                choices: null,
                setFlag: 'ch1_got_weapon',
              };
            } else if (activeFlags.has('ch1_reached_peak') && !activeFlags.has('ch1_got_weapon')) {
              startNode = fetchedNodes.find(d => d.id === 'dlg_blacksmith_reward' || d.orderIndex === 3);
            } else if (activeFlags.has('ch1_blacksmith_quest')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Thu thập đủ 5 Đá Linh Hồn mang về đây, ta sẽ rèn Kiếm Băng Hàn cho ngươi.',
                speaker: 'Thợ rèn',
                choices: null,
                setFlag: 'ch1_blacksmith_quest',
              };
            } else if (activeFlags.has('ch1_sent_to_blacksmith')) {
              startNode = fetchedNodes.find(d => d.orderIndex === 0);
            }
          } else if (activeNpc.name === 'Bia Đá Cổ') {
            if (activeFlags.has('ch1_stele_read')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Bia Đá Cổ đã bị rêu phong che phủ, không thể đọc thêm gì khác.',
                speaker: 'Bia Đá Cổ',
                choices: null,
                setFlag: 'ch1_stele_read',
              };
            } else {
              startNode = fetchedNodes.find(d => d.orderIndex === 0);
            }
          } else if (activeNpc.name === 'Bạch Lang Vương') {
            if (activeFlags.has('ch1_boss_confronted')) {
              startNode = {
                id: 'fallback',
                orderIndex: 0,
                text: 'Gừ... Hãy chịu chết đi phàm nhân!',
                speaker: 'Bạch Lang Vương',
                choices: null,
                setFlag: 'ch1_boss_confronted',
              };
            } else {
              startNode = fetchedNodes.find(d => d.orderIndex === 0);
            }
          }

          // Fallback resolution if NPC-specific rules didn't yield a starting node
          if (!startNode) {
            // Find a node that requires a condition that matches current active flags,
            // then fallback to orderIndex 0, then first node
            const matchingConditionNode = fetchedNodes.find(d => {
              const cond = d.conditionFlag;
              return cond && activeFlags.has(cond);
            });
            startNode = matchingConditionNode || fetchedNodes.find((d) => d.orderIndex === 0) || fetchedNodes[0];
          }

          // If the starting node sets a flag the player already has, show fallback instead to avoid repeating completed dialogues
          const startNodeSetsFlag = startNode.setFlag;
          const isStartNodeCompleted = startNode.id !== 'fallback' && startNodeSetsFlag && activeFlags.has(startNodeSetsFlag);

          if (isStartNodeCompleted) {
            setCurrentNode({
              id: 'fallback',
              orderIndex: 0,
              text: `Chào đạo hữu! Ta là ${activeNpc.name}. Chúc ngươi tu tiên lộ thành công!`,
              speaker: activeNpc.name,
              choices: null,
            });
          } else {
            setCurrentNode(startNode);
          }
        } else {
          setCurrentNode({
            id: 'fallback',
            orderIndex: 0,
            text: `Chào đạo hữu! Ta là ${activeNpc.name}. Chúc ngươi tu tiên lộ thành công!`,
            speaker: activeNpc.name,
            choices: null,
          });
        }
      } catch (err) {
        console.error('[DialoguePanel] Failed to load dialogues:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchDialogues();
  }, [isDialogueOpen, activeNpc]);

  if (!isDialogueOpen || !activeNpc) return null;

  const handleChoice = async (choice: DialogueChoice) => {
    if (currentNode?.setFlag) {
      await setStoryFlagAndCheckQuests(currentNode.setFlag);
    }

    if (choice.next_dialogue_id) {
      const next = dialogues.find((d) => d.id === choice.next_dialogue_id);
      if (next) {
        setCurrentNode(next);
        return;
      }
    }

    closeDialogue();
  };

  const handleClose = async () => {
    if (currentNode && currentNode.setFlag) {
      await setStoryFlagAndCheckQuests(currentNode.setFlag);
    }
    closeDialogue();
  };

  const setStoryFlagAndCheckQuests = async (flagKey: string) => {
    try {
      const flagRes = await fetchWithAuth('/api/story/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagKey: flagKey, flagValue: 'true' }),
      });
      await flagRes.json(); // confirm flag was set
      const qTemplatesRes = await fetchWithAuth('/api/quest');
      const qTemplatesJson = await qTemplatesRes.json();
      if (qTemplatesJson.success && qTemplatesJson.data) {
        const templates = qTemplatesJson.data as Array<{ id: string; flagRequired: string }>;
        const unlockedQuests = templates.filter((q) => q.flagRequired === flagKey);
        
        for (const quest of unlockedQuests) {
          await fetchWithAuth('/api/quest/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questId: quest.id }),
          });
        }
      }

      const activeQuestsRes = await fetchWithAuth('/api/quest/player/active');
      const activeQuestsJson = await activeQuestsRes.json();
      if (activeQuestsJson.success && activeQuestsJson.data) {
        setActiveQuests(activeQuestsJson.data as unknown[]);
      }
    } catch (err) {
      console.error('[DialoguePanel] setStoryFlagAndCheckQuests failed:', err);
    }
  };

  const choicesList: DialogueChoice[] | null = currentNode?.choices
    ? typeof currentNode.choices === 'string'
      ? (JSON.parse(currentNode.choices) as DialogueChoice[])
      : (currentNode.choices as DialogueChoice[])
    : null;

  return (
    <div style={styles.dialogueOverlay}>
      <div style={styles.dialogueContainer}>
        <div style={styles.npcAvatar}>
          <div style={styles.avatarCircle}>
            <span style={{ fontSize: '24px' }}>👤</span>
          </div>
        </div>

        <div style={styles.dialogueContent}>
          <div style={styles.speakerName}>{currentNode?.speaker || activeNpc.name}</div>
          <div style={styles.dialogueText}>
            {loading ? 'Đang tải hội thoại...' : currentNode?.text}
          </div>
        </div>
        
        <div style={styles.choicesContainer}>
          {!loading && activeNpc && (activeNpc.hasShop === true || String(activeNpc.hasShop) === 'true') && (
            <button
              style={{ ...styles.choiceButton, backgroundColor: '#c5a880', color: '#111', fontWeight: 'bold' }}
              onClick={() => {
                const npc = activeNpc;
                closeDialogue();
                toggleShop(true, { id: npc.id, name: npc.name });
              }}
            >
              🛒 Mở Cửa Hàng
            </button>
          )}
          {!loading && choicesList && choicesList.length > 0 ? (
            choicesList.map((choice, index: number) => (
              <button
                key={index}
                style={styles.choiceButton}
                onClick={() => {
                  void handleChoice(choice);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleChoice(choice);
                }}
              >
                {choice.text}
              </button>
            ))
          ) : (
            <button
              style={styles.choiceButton}
              onClick={() => {
                void handleClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleClose();
              }}
            >
              Tiếp tục
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dialogueOverlay: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '760px',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    pointerEvents: 'auto',
  },
  dialogueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: 'rgba(15, 15, 25, 0.9)',
    border: '2px solid rgba(212, 175, 55, 0.5)',
    borderRadius: '16px',
    padding: '16px 24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#e0e0e0',
    minHeight: '110px',
    position: 'relative',
    pointerEvents: 'auto',
  },
  npcAvatar: {
    marginRight: '20px',
    flexShrink: 0,
  },
  avatarCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(15, 15, 25, 0.8))',
    border: '1.5px solid #d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },
  dialogueContent: {
    flexGrow: 1,
    textAlign: 'left',
  },
  speakerName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: '4px',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
  },
  dialogueText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#f0f0f0',
  },
  choicesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginLeft: '20px',
    flexShrink: 0,
    width: '160px',
  },
  choiceButton: {
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.5)',
    borderRadius: '8px',
    color: '#d4af37',
    padding: '8px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontWeight: '500',
    textShadow: '0 1px 1px rgba(0,0,0,0.5)',
  },
};
