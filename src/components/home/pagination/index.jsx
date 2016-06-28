import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './style.scss';

const Pagination = ({ currentPage, totalPages, goToPage }) => {
    const NUM_PAGES = Math.min(7, totalPages);

    const half = Math.floor(NUM_PAGES / 2);

    let numberOptions = [];
    const start = Math.max(currentPage - half, 1);
    const end = Math.min((currentPage + half), totalPages);
    for (let i = start; i <= end; i++) {
        numberOptions.push(i);
    }

    if (numberOptions.length < NUM_PAGES) {
        if (numberOptions[0] === 1) {
            const extraNumberOptions = [];
            for (let i = 1; i <= NUM_PAGES - numberOptions.length; i++) {
                extraNumberOptions.push(numberOptions[numberOptions.length - 1] + i);
            }
            numberOptions = numberOptions.concat(extraNumberOptions);
        } else if (numberOptions[numberOptions.length - 1] === totalPages) {
            const extraNumberOptions = [];
            for (let i = NUM_PAGES - numberOptions.length; i >= 1; i--) {
                extraNumberOptions.push(numberOptions[0] - i);
            }
            numberOptions = extraNumberOptions.concat(numberOptions);
        }
    }

    const pageNumbers = numberOptions.map((n) => (
        <h3
          className={classNames('page-option', { active: (n === currentPage) })}
          onClick={() => goToPage(n)}
        >
            {n}
        </h3>
    ));

    return (
        <div className="pagination">
            <h3
              className="page-option left page-arrow"
              onClick={() => goToPage(Math.max(currentPage - 1, 1))}
            >
                &#9650;
            </h3>
            {pageNumbers}
            <h3
              className="page-option right page-arrow"
              onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
            >
                &#9650;
            </h3>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    goToPage: PropTypes.func,
};

export default Pagination;
