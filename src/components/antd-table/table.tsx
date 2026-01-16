import React from 'react';
import type { TableColumnsType } from 'antd';
import { Space, Table } from 'antd';

interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface TaskActionUrl {
  view: string;
  edit: string;
  delete: string;
  execute: string;
}

interface TaskRow {
  id: number;
  name: string;
  description: string;
  status: string;
  scope: string;
  method: string;
  host: string;
  endpoint: string;
  parameters: string;
  pre_call: string;
  post_call: string;
  must_complete: boolean;
  status_trigger: string;
  group_name: string;
  trigger: string;
  action: string;
  action_url: TaskActionUrl;
}

// This will be used inside the expanded row as the nested table's data.
const taskData: TaskRow[] = [
  {
    id: 1,
    name: 'Fetch User Data',
    description: 'Retrieve user data from external service',
    status: 'active',
    scope: 'user',
    method: 'GET',
    host: 'api.example.com',
    endpoint: '/v1/users',
    parameters: 'limit=10&offset=0',
    pre_call: 'validate_auth_token',
    post_call: 'normalize_response',
    must_complete: true,
    status_trigger: 'on_success',
    group_name: 'User Operations',
    trigger: 'manual',
    action: 'fetch',
    action_url: {
      view: '/tasks/1/view',
      edit: '/tasks/1/edit',
      delete: '/tasks/1/delete',
      execute: '/tasks/1/execute',
    },
  },
  {
    id: 2,
    name: 'Sync Orders',
    description: 'Synchronize orders with ERP system',
    status: 'pending',
    scope: 'order',
    method: 'POST',
    host: 'erp.example.com',
    endpoint: '/api/orders/sync',
    parameters: '{"sync_mode":"incremental"}',
    pre_call: 'check_order_queue',
    post_call: 'update_sync_status',
    must_complete: false,
    status_trigger: 'on_completion',
    group_name: 'Order Management',
    trigger: 'scheduled',
    action: 'sync',
    action_url: {
      view: '/tasks/2/view',
      edit: '/tasks/2/edit',
      delete: '/tasks/2/delete',
      execute: '/tasks/2/execute',
    },
  },
];

const taskColumns: TableColumnsType<TaskRow> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description', width: 260 },
  { title: 'Group', dataIndex: 'group_name', key: 'group_name' },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space size="small">
        <a href={record.action_url.view}>View</a>
        <a href={record.action_url.edit}>Edit</a>
        <a href={record.action_url.execute}>Run</a>
      </Space>
    ),
  },
];

const dataSource = Array.from({ length: 3 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));


const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation', render: () => <a>View</a> },
];

// const expandedRowRender = () => (
//   <Table<ExpandedDataType>
//     columns={expandColumns}
//     dataSource={expandDataSource}
//     pagination={false}
//   />
// );

const expandedRowRender2: (record: DataType) => React.ReactNode = () => {
  // You can still use the parent row `record` here later to filter `taskData`.
  return (
    <Table<TaskRow>
      size="small"
      columns={taskColumns}
      dataSource={taskData}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};
  

const AntDTableWithSubRows: React.FC = () => (
  <>
    <Table<DataType>
      columns={columns}
      expandable={{ expandedRowRender : expandedRowRender2 }}
      dataSource={dataSource}
    />
    {/* <Table<DataType>
      columns={columns}
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
      dataSource={dataSource}
      size="middle"
    />
    <Table<DataType>
      columns={columns}
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
      dataSource={dataSource}
      size="small"
    /> */}
  </>
);

export default AntDTableWithSubRows;