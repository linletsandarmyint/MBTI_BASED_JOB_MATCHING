import React from "react";

export default function EmptyState({ title = "No items", description = "Nothing to show here.", action }) {
  return (
    <div className="bg-white rounded-lg p-6 text-center border">
      <div className="text-4xl mb-3">📭</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
