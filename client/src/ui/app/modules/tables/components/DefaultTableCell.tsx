import * as React from 'react';

export const DefaultTableCell: React.SFC = ({ children }) => (
  <div className="text-truncate w-100 px-2">
    {children}
  </div>
);
