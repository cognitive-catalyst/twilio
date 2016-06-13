import d3 from 'd3';

function create(element, options) {
    options = options || {};

    let width = options.width || 100;
    let height = options.height || 100;
    let radius = Math.min(width, height) / 2;
    let donutWidth = options.donutWidth || 12;
    let dataset = options.data || [];

    let svg = d3.select('#' + element)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    let text = svg.append('text')
        .attr('text-anchor', 'middle');

    text.append('tspan')
        .attr('id', 'percentText' + element)
        .attr('x', '0')
        .attr('dy', '2px')
        .attr('class', 'percent-text');

    text.append('tspan')
        .attr('id', 'percentLabelText' + element)
        .attr('class', 'label-text')

    text.append('tspan')
        .attr('id', 'labelText' + element)
        .attr('x', '0')
        .attr('dy', '1.2em')
        .attr('class', 'label-text');

    let arc = d3.svg.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    let pie = d3.layout.pie()
        .sort(null)
        .value(d => d.value);

    let path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color);

    function setText(percent, label) {
        d3.select('#percentText' + element).text(percent);
        d3.select('#labelText' + element).text(label);
        d3.select('#percentLabelText' + element).text('%');
    }

    function setDefaultText() {
        if(dataset.length === 0) {
            d3.select('#percentText' + element).text('NO');
            d3.select('#labelText' + element).text('DATA');
            d3.select('#percentLabelText' + element).text('');
            return;
        }
        let total = dataset.reduce((total, next) => total + next.value, 0);
        let maxObj = dataset.reduce((a, b) => a.value > b.value ? a : b);
        let percent = Math.round(100 * maxObj.value / total);
        setText(percent, maxObj.label);
    }

    function updateData(data) {
        if (data.constructor === Array) {
            path = path.data(pie(data));
            path.enter().append('path');
            path.exit().remove();
            path.attr('fill', d => d.data.color);
            path.attr('d', arc);
            dataset = data;
            addEventListeners();
            setDefaultText();
        }
    }

    function addEventListeners() {
        path.on('mouseover', null);
        path.on('mouseout', null);
        path.on('mouseover', d => {
            let total = dataset.reduce((total, next) => total + next.value, 0);
            let percent = Math.round(100 * d.data.value / total);
            setText(percent, d.data.label);
        });

        path.on('mouseout', () => setDefaultText());
    }

    addEventListeners();

    return {
        setText,
        setDefaultText,
        updateData
    };
}

export default {
    create
};
