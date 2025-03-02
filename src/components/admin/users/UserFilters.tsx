
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department } from '@/types/admin';

export interface UserFiltersProps {
  status: string;
  department: string;
  search: string;
  onStatusChange: (status: string) => void;
  onDepartmentChange: (department: string) => void;
  onSearchChange: (search: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  status,
  department,
  search,
  onStatusChange,
  onDepartmentChange,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="flex gap-4">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {/* We would typically map through departments here */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
