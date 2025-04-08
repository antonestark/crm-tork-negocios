import React from 'react';

interface PermissionCardProps {
  title: string;
  description: string;
  tags?: string[];
  actionTag: string;
  code: string;
}

export function PermissionCard({
  title,
  description,
  tags = [],
  actionTag,
  code,
}: PermissionCardProps) {
  return (
    <div className="relative rounded-lg border border-[#1f2937] bg-[#0b1120] p-4 shadow transition hover:shadow-lg">
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800"
          >
            {tag}
          </span>
        ))}
        <span className="inline-block rounded-full bg-gray-600 px-2 py-0.5 text-xs font-medium text-white">
          {actionTag}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">Código: <code>{code}</code></p>
      <div className="border-t border-gray-700 my-3"></div>
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1 rounded border border-gray-500 bg-white px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
          </svg>
          Editar
        </button>
        <button className="flex items-center gap-1 rounded border border-gray-500 bg-white px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Excluir
        </button>
      </div>
      <div className="absolute top-3 right-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      </div>
    </div>
  );
}
