
import { Card, Col, Row, Button, Typography, Space } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Dummy data for job posts
const jobPosts = [
  {
    id: 1,
    title: 'HOTEL RESERVATION SPECIALIST HOTEL RESERVATION SPECIALISTHOTEL RESERVATION SPECIALIST',
    company: 'Hotel Mi Rochor',
    duration: '1 Apr - 4 Dec',
    image: '/public/assets/profiles.jpg',
    color: '#52c41a', // green
    category: 'Hotel'
  },
  {
    id: 2,
    title: 'BELL BOY ',
    company: 'Grand Hotel',
    duration: '4 Feb - 3 Dec',
    image: '/public/assets/profiles.jpg',
    color: '#faad14', // yellow
    category: 'Service'
  },
  {
    id: 3,
    title: 'SENIOR ',
    company: 'V Hotel Bencoolen',
    duration: '1 Apr - 2 Jun',
    image: '/public/assets/profiles.jpg',
    color: '#1890ff', // blue
    category: 'F&B'
  },
  {
    id: 4,
    title: 'EVENT MANAGEMENT COORDINATOR',
    company: 'Luxury Events Co',
    duration: '3 Jan - 1 Mar',
    image: '/public/assets/profiles.jpg',
    color: '#722ed1', // purple
    category: 'Events'
  },
  {
    id: 5,
    title: 'FRONT DESK RECEPTION MANAGER',
    company: 'Marina Bay Hotel',
    duration: '15 Mar - 30 Nov',
    image: '/public/assets/profiles.jpg',
    color: '#eb2f96', // pink
    category: 'Reception'
  },
  {
    id: 6,
    title: 'HEAD CHEF CULINARY EXPERT',
    company: 'Gourmet Restaurant',
    duration: '1 May - 31 Oct',
    image: '/public/assets/profiles.jpg',
    color: '#fa541c', // orange
    category: 'Kitchen'
  }
];

const AntdCards = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 'bold' }}>JOB POSTS</Title>
        <Space>
          <Button type="text" icon="+" style={{ fontSize: '24px', fontWeight: 'bold' }} />
          <Button type="text" icon="↗" style={{ fontSize: '18px' }} />
        </Space>
      </div>
      
      <Row gutter={[16, 16]}>
        {jobPosts.map((job) => (
          <Col xs={24} sm={12} md={8} lg={6} key={job.id} style={{ display: 'flex' }}>
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{
                padding: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              cover={
                <div style={{ height: '200px', position: 'relative' }}>
                  <img
                    alt={job.title}
                    src={job.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              }
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                position: 'relative'
              }}>
                <div
                  style={{
                    width: '4px',
                    height: '50px',
                    backgroundColor: job.color,
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    borderRadius: '0 2px 2px 0'
                  }}
                />
                
                <Title level={4} style={{ 
                  margin: '0 0 12px 0', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  lineHeight: '1.3',
                  flex: '1',
                  display: 'flex',
                  alignItems: 'flex-start',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  minHeight: '0'
                }}>
                  {job.title}
                </Title>
                
                <div style={{ 
                  marginTop: 'auto',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}>
                  <Text style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {job.company}
                  </Text>
                  
                  <Text style={{ 
                    display: 'block', 
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#999'
                  }}>
                    {job.duration}
                  </Text>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f0f0f0',
                    height: '48px',
                    alignItems: 'center'
                  }}>
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      style={{ color: '#999', padding: '4px 8px' }}
                    />
                    <Button 
                      type="text" 
                      icon={<UserOutlined />} 
                      style={{ color: '#999', padding: '4px 8px' }}
                    />
                    <Button 
                      type="text" 
                      icon={<CalendarOutlined />} 
                      style={{ color: '#999', padding: '4px 8px' }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AntdCards;