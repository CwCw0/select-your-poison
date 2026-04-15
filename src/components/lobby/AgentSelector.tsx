'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agents, roleLabels, getAgentsByRole } from '@/lib/agents';
import { AgentType, AgentRole } from '@/types';

interface AgentSelectorProps {
  selected: AgentType | null;
  onSelect: (agent: AgentType) => void;
}

const roles: AgentRole[] = ['duelist', 'initiator', 'controller', 'sentinel'];

export default function AgentSelector({ selected, onSelect }: AgentSelectorProps) {
  const [expandedAgent, setExpandedAgent] = useState<AgentType | null>(selected);

  const selectedAgent = selected ? agents.find(a => a.id === selected) : null;

  return (
    <div className="space-y-5">
      {roles.map((role) => {
        const roleAgents = getAgentsByRole(role);
        return (
          <div key={role}>
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {roleLabels[role]}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {roleAgents.map((agent) => {
                const isSelected = selected === agent.id;
                return (
                  <motion.button
                    key={agent.id}
                    onClick={() => {
                      onSelect(agent.id);
                      setExpandedAgent(agent.id);
                    }}
                    className="p-2 rounded-lg border text-center transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      borderColor: isSelected ? agent.color : 'var(--border-default)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="font-mono text-[10px] font-bold tracking-wider truncate"
                      style={{ color: isSelected ? agent.color : 'var(--text-secondary)' }}
                    >
                      {agent.name.toUpperCase()}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selected Agent Rules Preview */}
      <AnimatePresence mode="wait">
        {selectedAgent && expandedAgent === selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: selectedAgent.color,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedAgent.color }}
              />
              <span
                className="font-mono text-xs font-bold tracking-wider"
                style={{ color: selectedAgent.color }}
              >
                {selectedAgent.name.toUpperCase()} RULES
              </span>
            </div>
            <div className="space-y-1.5">
              {selectedAgent.rules.map((rule, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {rule.rule}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold shrink-0"
                    style={{ color: 'var(--accent-red)' }}
                  >
                    {rule.drinks}×
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
