const getStartNumber = ({ page, itemsPerPage }) => {
    if (page === 1) return 1;
    return (page * itemsPerPage) - (itemsPerPage - 1);
};

const getEndNumber = ({ page, itemsPerPage, totalResults }) => {
    const res = page * itemsPerPage;
    return res < totalResults ? res : totalResults;
};

// eslint-disable-next-line import/prefer-default-export
export const getItemsRange = ({ page, itemsPerPage, totalResults }) => {
    const start = getStartNumber({ page, itemsPerPage });
    const end = getEndNumber({ page, itemsPerPage, totalResults });

    return { start, end };
};
