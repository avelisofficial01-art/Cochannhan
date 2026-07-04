import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

interface DialogueChoice {
  text: string;
  next_dialogue_ref: string;
  next_dialogue_id?: string;
}

interface DialogueNode {
  id: string;
  order_index: number;
  text: string;
  speaker: string;
  choices: DialogueChoice[] | string | null;
  condition_flag?: string;
  set_flag?: string;
}

export const DialoguePanel: React.FC = () => {
  const { activeNpc, isDialogueOpen, closeDialogue, setActiveQuests } = useGameStore();
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
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/npc/${activeNpc.id}/dialogues`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const fetchedNodes = json.data as DialogueNode[];
          setDialogues(fetchedNodes);
          const startNode = fetchedNodes.find((d) => d.order_index === 0) || fetchedNodes[0];
          setCurrentNode(startNode);
        } else {
          setCurrentNode({
            id: 'fallback',
            order_index: 0,
            text: `Chào đạo hữu! Ta là ${activeNpc.name}. Chúc ngươi tu tiên lộ thành công!`,
            speaker: activeNpc.name,
            choices: null,
          });
        }
      } catch (err) {
        console.error('[Dialogue] fetchDialogues ERROR:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDialogues();
  }, [isDialogueOpen, activeNpc]);

  if (!isDialogueOpen || !activeNpc) return null;

  const handleChoice = async (choice: DialogueChoice) => {
    if (currentNode?.set_flag) {
      await setStoryFlagAndCheckQuests(currentNode.set_flag);
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
    if (currentNode && currentNode.set_flag) {
      await setStoryFlagAndCheckQuests(currentNode.set_flag);
    }
    closeDialogue();
  };

  const setStoryFlagAndCheckQuests = async (flagKey: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log('[Dialogue] 🔑 setStoryFlag:', flagKey);
      const flagRes = await fetch('/api/quest/flags/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: flagKey, value: true }),
      });
      const flagJson = await flagRes.json();
      console.log('[Dialogue] Flag set result:', flagJson);

      const qTemplatesRes = await fetch('/api/quest', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const qTemplatesJson = await qTemplatesRes.json();
      console.log('[Dialogue] Quest templates fetched, count:', qTemplatesJson.data?.length);

      if (qTemplatesJson.success && qTemplatesJson.data) {
        const templates = qTemplatesJson.data as Array<{ id: string; flagRequired: string }>;
        console.log('[Dialogue] Templates with flagRequired:', templates.map(t => `${t.flagRequired || 'NONE'}`).join(', '));
        const unlockedQuests = templates.filter((q) => q.flagRequired === flagKey);
        console.log('[Dialogue] Unlocked for flag', flagKey, ':', unlockedQuests.length, 'quests');
        
        for (const quest of unlockedQuests) {
          console.log('[Dialogue] Accepting quest:', quest.id);
          await fetch('/api/quest/accept', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ questId: quest.id }),
          });
        }
      }

      const activeQuestsRes = await fetch('/api/quest/player/active', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeQuestsJson = await activeQuestsRes.json();
      console.log('[Dialogue] Active quests:', activeQuestsJson);
      if (activeQuestsJson.success && activeQuestsJson.data) {
        console.log('[Dialogue] ✅ Setting', activeQuestsJson.data.length, 'active quests');
        setActiveQuests(activeQuestsJson.data as unknown[]);
      }
    } catch (err) {
      console.error('[Dialogue] setStoryFlagAndCheckQuests ERROR:', err);
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
          {!loading && choicesList && choicesList.length > 0 ? (
            choicesList.map((choice, index: number) => (
              <button
                key={index}
                style={styles.choiceButton}
                onClick={() => {
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
