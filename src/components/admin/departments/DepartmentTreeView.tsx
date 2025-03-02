
import React from 'react';
import { ChevronRight, ChevronDown, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DepartmentTreeViewProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onViewMembers: (department: Department) => void;
  loading: boolean;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  children?: Department[];
  // Add any other department properties here
}

export const DepartmentTreeView: React.FC<DepartmentTreeViewProps> = ({
  departments,
  onEdit,
  onDelete,
  onViewMembers,
  loading
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderDepartment = (department: Department, level = 0) => {
    const isExpanded = !!expandedItems[department.id];
    const hasChildren = department.children && department.children.length > 0;
    
    return (
      <div key={department.id} className="department-item">
        <div 
          className="flex items-center py-2 hover:bg-gray-50 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={() => toggleItem(department.id)}
              className="p-1 rounded-full hover:bg-gray-200 mr-1"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6 h-6 mr-1"></div>
          )}
          
          <span className="flex-grow font-medium">{department.name}</span>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewMembers(department);
              }}
            >
              <Users size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(department);
              }}
            >
              <Edit size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(department);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="department-children">
            {department.children!.map(child => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Loading departments...</div>;
  }

  if (!departments || departments.length === 0) {
    return <div className="p-4 text-center">No departments found.</div>;
  }

  return (
    <div className="department-tree">
      {departments.map(department => renderDepartment(department))}
    </div>
  );
};

export default DepartmentTreeView;
