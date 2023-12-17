const calculateReportInnerAverage = (data) => {
    if (Array.isArray(data) && data.length > 0) {
        const sum = data.reduce((total, item) => total + calculateReportInnerAverage(item), 0);
        return sum / data.length;
    } else if (typeof data === 'object' && data !== null && 'grade' in data) {
        return parseFloat(data.grade) || 0;
    } else {
        return 0;
    }
};

module.exports = {
    calculateReportInnerAverage
}