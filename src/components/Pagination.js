import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, nPages, setCurrentPage }) => {
  const pages = [];
  
  // criar botões para cada página
  for (let p = 1; p <= nPages; p++) {
    pages.push(
      <Pagination.Item 
        key={p} 
        // active={p === currentPage}
        onClick={() => setCurrentPage(p)}
      >
        {p}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev 
        onClick={() => setCurrentPage(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      {pages}
      <Pagination.Next 
        onClick={() => setCurrentPage(currentPage + 1)} 
        disabled={currentPage === nPages} 
      />
    </Pagination>
  );
};

export default PaginationComponent;