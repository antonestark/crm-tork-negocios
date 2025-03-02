
import { useState } from 'react';
import { ChevronRight, ChevronDown, Users, User } from 'lucide-react';
import { Department } from '@/types/admin';

interface DepartmentTreeViewProps {
  departments: Department[];
  onSelect: (department: Department) => void;
  selectedId?: string;
}

const DepartmentTreeView: React.FC<DepartmentTreeViewProps> = ({ 
  departments, 
  onSelect,
  selectedId 
}) => {
  // Convert flat departments list to hierarchical structure
  const buildTree = (items: Department[]) => {
    const rootItems: Department[] = [];
    const lookup: Record<string, Department & { children: Department[] }> = {};
    
    items.forEach(item => {
      const newItem = { ...item, children: [] };
      lookup[item.id] = newItem as Department & { children: Department[] };
      
      if (item.parent_id === null) {
        rootItems.push(newItem);
      }
    });
    
    items.forEach(item => {
      if (item.parent_id !== null && lookup[item.parent_id]) {
        lookup[item.parent_id].children.push(lookup[item.id]);
      }
    });
    
    return rootItems;
  };

  const treeData = buildTree(departments);
  
  return (
    <div className="border rounded-md p-4 bg-white">
      <DepartmentNode 
        nodes={treeData} 
        onSelect={onSelect} 
        level={0}
        selectedId={selectedId}
      />
    </div>
  );
};

interface DepartmentNodeProps {
  nodes: (Department & { children?: Department[] })[];
  onSelect: (department: Department) => void;
  level: number;
  selectedId?: string;
}

const DepartmentNode: React.FC<DepartmentNodeProps> = ({ 
  nodes, 
  onSelect, 
  level, 
  selectedId 
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <ul className={`pl-${level > 0 ? '4' : '0'} space-y-1`}>
      {nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expanded[node.id];
        const isSelected = node.id === selectedId;
        
        return (
          <li key={node.id} className="py-1">
            <div className={`
              flex items-center space-x-1 p-2 rounded-md
              ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
              cursor-pointer
            `}>
              {/* Expand button only if has children */}
              <button 
                onClick={() => toggleExpand(node.id)}
                className={`w-5 h-5 ${!hasChildren && 'invisible'}`}
              >
                {hasChildren && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              
              {/* Department icon */}
              <div className="mr-1 text-gray-500">
                {hasChildren ? <Users size={16} /> : <User size={16} />}
              </div>
              
              {/* Department name */}
              <div
                onClick={() => onSelect(node)}
                className="flex-1 text-sm font-medium"
              >
                {node.name}
                
                {/* Member count badge */}
                {node._memberCount !== undefined && node._memberCount > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    {node._memberCount}
                  </span>
                )}
              </div>
            </div>
            
            {/* Render children if expanded */}
            {hasChildren && isExpanded && (
              <DepartmentNode 
                nodes={node.children!} 
                onSelect={onSelect} 
                level={level + 1}
                selectedId={selectedId}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DepartmentTreeView;
