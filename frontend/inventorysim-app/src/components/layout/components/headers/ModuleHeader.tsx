import type { ReactNode } from "react";
import PrimeBreadcrumb from "../main/PrimeBreadcrumb";

interface ModuleContainerProps {
  title: string
  subtitle?: string
  breadcrumbTrail: { label: string; path?: string }[]
  userCases?: string[]
  onUserCaseChange?: (value: string) => void
  actions?: ReactNode
  children: ReactNode
}


const ModuleHeader:React.FC<ModuleContainerProps>= ({
     title,
  subtitle,
  breadcrumbTrail,
  userCases = [],
  onUserCaseChange,
  actions,
  children,
}: ModuleContainerProps) => {
  return (
    <div className="flex flex-col w-full p-6 space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userCases.length > 0 && (
            <select
              onChange={(e) => onUserCaseChange?.(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-primary/30"
            >
              {userCases.map((uc, idx) => (
                <option key={idx} value={uc}>{uc}</option>
              ))}
            </select>
          )}
          {actions}
        </div>
      </div>

      {/* Breadcrumb */}
      <PrimeBreadcrumb trail={breadcrumbTrail} />

      <hr className="border-gray-200" />

      {/* Main Module Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default ModuleHeader