const CheckListSchema = {
    name: 'CheckList',
    primaryKey: 'taskId',
    properties:
    {
        checkList: 'string',
        taskId: 'string', // primary key
        timeElapsed: 'string',
        timeStarted: 'string'
    }
};
export default CheckListSchema;