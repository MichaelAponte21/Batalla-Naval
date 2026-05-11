import { motion } from 'framer-motion';
import { useGameStore, SCREENS } from './store/gameStore.js';
import MainMenu from './screens/MainMenu.jsx';
import Setup from './screens/Setup.jsx';
import Battle from './screens/Battle.jsx';
import EndScreen from './screens/EndScreen.jsx';
import { useAudio } from './hooks/useAudio.js';

const SCREEN_COMPONENTS = {
  [SCREENS.MENU]:   MainMenu,
  [SCREENS.SETUP]:  Setup,
  [SCREENS.BATTLE]: Battle,
  [SCREENS.END]:    EndScreen
};

export default function App() {
  const screen = useGameStore(s => s.screen);
  const mode = useGameStore(s => s.mode);
  useAudio();

  const themeClass = mode === 'advanced' ? 'theme-advanced' : 'theme-classic';
  const Current = SCREEN_COMPONENTS[screen] || MainMenu;

  return (
    <div className={`${themeClass} relative w-full h-full overflow-hidden`}>
      <motion.div
        key={screen}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Current />
      </motion.div>
    </div>
  );
}
