

// Layout wrapper for header action controls in a module.

const ModuleHeaderActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full">
      {children}
    </div>
  );
};

export default ModuleHeaderActions;
