import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { StoreHydrator } from '@/components/layout/store-hydrator';
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'BUMDes Desa Wengkal';

createInertiaApp({
  title: (title) => (title ? `${title}` : appName),
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    const page = pages[`./Pages/${name}.tsx`];
    if (!page) {
      throw new Error(`Page ${name} not found in ./Pages/`);
    }
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <StoreHydrator initialData={(props.initialPage.props as any)?.initialData}>
        <App {...props} />
        <Toaster />
      </StoreHydrator>
    );
  },
  progress: {
    color: '#0b63ce',
  },
});
