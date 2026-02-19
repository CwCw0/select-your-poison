'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Trophy, AlertTriangle, Info, Beer } from 'lucide-react';
import { create } from 'zustand';
import { useEffect } from 'react';

// Notification types
export type NotificationType = 'player_join' | 'player_leave' | 'success' | 'warning' | 'info' | 'drink';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  playerName?: string;
  playerColor?: string;
  duration?: number;
}

// Notification store
interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }].slice(-5), // Max 5 notifications
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  clearAll: () => set({ notifications: [] }),
}));

// Helper functions
export const showPlayerJoinNotification = (playerName: string, playerColor?: string) => {
  useNotificationStore.getState().addNotification({
    type: 'player_join',
    title: 'AGENT CONNECTED',
    message: `${playerName} has joined the squad`,
    playerName,
    playerColor: playerColor || '#7DD3FC',
    duration: 4000,
  });
};

export const showPlayerLeaveNotification = (playerName: string) => {
  useNotificationStore.getState().addNotification({
    type: 'player_leave',
    title: 'AGENT DISCONNECTED',
    message: `${playerName} has left the squad`,
    playerName,
    duration: 3000,
  });
};

export const showDrinkNotification = (playerName: string, drinks: number) => {
  useNotificationStore.getState().addNotification({
    type: 'drink',
    title: 'DRINKS EARNED',
    message: `${playerName} takes ${drinks} drink${drinks > 1 ? 's' : ''}!`,
    duration: 3000,
  });
};

export const showSuccessNotification = (title: string, message?: string) => {
  useNotificationStore.getState().addNotification({
    type: 'success',
    title: title.toUpperCase(),
    message,
    duration: 4000,
  });
};

export const showWarningNotification = (title: string, message?: string) => {
  useNotificationStore.getState().addNotification({
    type: 'warning',
    title: title.toUpperCase(),
    message,
    duration: 5000,
  });
};

export const showInfoNotification = (title: string, message?: string) => {
  useNotificationStore.getState().addNotification({
    type: 'info',
    title: title.toUpperCase(),
    message,
    duration: 4000,
  });
};

export const showErrorNotification = (title: string, message?: string) => {
  useNotificationStore.getState().addNotification({
    type: 'warning',
    title: title.toUpperCase(),
    message,
    duration: 6000,
  });
};

// Notification component
function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const { type, title, message, playerColor, duration = 4000 } = notification;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'player_join':
        return <UserPlus style={{ width: '20px', height: '20px' }} />;
      case 'player_leave':
        return <X style={{ width: '20px', height: '20px' }} />;
      case 'success':
        return <Trophy style={{ width: '20px', height: '20px' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '20px', height: '20px' }} />;
      case 'drink':
        return <Beer style={{ width: '20px', height: '20px' }} />;
      default:
        return <Info style={{ width: '20px', height: '20px' }} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'player_join':
        return { bg: playerColor || '#22C55E', accent: playerColor || '#22C55E', text: '#FFFFFF' };
      case 'player_leave':
        return { bg: '#EF4444', accent: '#EF4444', text: '#FFFFFF' };
      case 'success':
        return { bg: '#22C55E', accent: '#22C55E', text: '#FFFFFF' };
      case 'warning':
        return { bg: '#F59E0B', accent: '#F59E0B', text: '#0C0C0C' };
      case 'drink':
        return { bg: '#FF0000', accent: '#FF0000', text: '#FFFFFF' };
      default:
        return { bg: '#3B82F6', accent: '#3B82F6', text: '#FFFFFF' };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: '#0C0C0C',
        border: `1px solid ${colors.accent}`,
        boxShadow: `0 0 20px ${colors.accent}40`,
        overflow: 'hidden',
        minWidth: '320px',
        maxWidth: '400px',
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: '4px',
          backgroundColor: colors.accent,
        }}
      />

      {/* Icon section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: `${colors.accent}20`,
          color: colors.accent,
        }}
      >
        {getIcon()}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: colors.accent,
            fontFamily: 'var(--font-space-mono), monospace',
          }}
        >
          {title}
        </span>
        {message && (
          <span
            style={{
              fontSize: '13px',
              color: '#CCCCCC',
              fontFamily: 'var(--font-space-mono), monospace',
            }}
          >
            {message}
          </span>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          padding: '12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#666666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: colors.accent,
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}

// Notification container
export default function Notifications() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} style={{ pointerEvents: 'auto' }}>
            <NotificationItem
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
