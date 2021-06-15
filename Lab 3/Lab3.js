let list = [];
exports.handler = async (event) => {
    let task = event.params.querystring.task;
    list.push(task);
    return 'To-do : ' + list;
}
