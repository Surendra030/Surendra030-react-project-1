export const isDevToolsOpen = (): boolean => {
  let isOpen = false;
  const threshold = 160; // DevTools height/width threshold in pixels

  // Check for DevTools based on window size differences
  const devtools = window.outerWidth - window.innerWidth > threshold || 
                   window.outerHeight - window.innerHeight > threshold;



  isOpen = devtools;

  // Additional check using debugger behavior
  const t0 = performance.now();
  debugger; // Trigger debugger
  const t1 = performance.now();
  if (t1 - t0 > 100) isOpen = true; // Debugger breakpoint detected
  
  
  return isOpen;
};
