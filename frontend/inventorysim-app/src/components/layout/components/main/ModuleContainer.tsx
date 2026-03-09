import type { ReactNode } from 'react';
import ModuleHeader from '../headers/ModuleHeader';

/**
 * Generic module layout container.
 * Provides a standardized page structure with header (title, breadcrumbs,
 * user-case selector, actions) and a styled content area for module views.
 */

interface ModuleContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbTrail?: { label: string; path?: string }[];
  userCases?: string[]; // Combo box options
  userCasesPlaceholder?: string;
  onUserCaseChange?: (value: string) => void;
  selectedUserCase?: string | null;
  actions?: ReactNode; // Extra buttons
  children: ReactNode; // Module content
  renderUserCaseItem?: (label: string) => ReactNode; // optional custom render per item
}

const ModuleContainer: React.FC<ModuleContainerProps> = ({
  title,
  subtitle,
  breadcrumbTrail,
  userCases,
  userCasesPlaceholder,
  onUserCaseChange,
  selectedUserCase,
  actions,
  children,
  renderUserCaseItem,
}) => {
  return (
    <div className="flex-1 flex flex-col px-3 py-4 sm:p-6 bg-gray-50 min-h-full">
      {/* Header row: title left, controls right */}

      <ModuleHeader
        title={title}
        subtitle={subtitle}
        breadcrumbTrail={breadcrumbTrail}
        userCases={userCases}
        userCasesPlaceholder={userCasesPlaceholder}
        onUserCaseChange={onUserCaseChange}
        selectedUserCase={selectedUserCase}
        actions={actions}
        renderUserCaseItem={renderUserCaseItem}
      />
      {/* Module content - mount it here */}
      <main className="flex-1 bg-white rounded-lg shadow p-4 min-h-[400px]">
        {children}
      </main>
    </div>
  );
};

export default ModuleContainer;
