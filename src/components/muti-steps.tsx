import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Step } = Steps;

const MultiSteps: React.FC = () => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleStep = (stepIndex: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(index => index !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const stepData = [
    {
      title: "Step 1",
      description: "This is step 1 description.",
      subSteps: [
        { title: "Sub item of step 1", description: "First sub-item description" },
        { title: "Another sub item", description: "Second sub-item description" },
        { title: "Third sub item", description: "Third sub-item description" }
      ]
    },
    {
      title: "Step 2",
      description: "This is step 2 description.",
      subSteps: [
        { title: "Sub item A", description: "Sub-item A description" },
        { title: "Sub item B", description: "Sub-item B description" }
      ]
    },
    {
      title: "Step 3",
      description: "This is step 3 description.",
      subSteps: [
        { title: "Sub item X", description: "Sub-item X description" },
        { title: "Sub item Y", description: "Sub-item Y description" },
        { title: "Sub item Z", description: "Sub-item Z description" }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: 600 }}>
      <Steps direction="vertical" current={1}>
        {stepData.map((step, index) => (
          <React.Fragment key={index}>
            <Step
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap:"5px" }}>
                  <Button
                    type="text"
                    icon={expandedSteps.includes(index) ? <DownOutlined /> : <RightOutlined />}
                    onClick={() => toggleStep(index)}
                    style={{ padding: 0, height: 'auto' }}
                  />
                  {step.title}
                </div>
              }
              description={step.description}
            />
            {expandedSteps.includes(index) && step.subSteps.map((subStep, subIndex) => (
              <Step
                key={`sub-${index}-${subIndex}`}
                title={
                  <div style={{ marginLeft: 24, color: '#666' }}>
                    {index + 1}.{subIndex + 1} {subStep.title}
                  </div>
                }
                description={
                  <div style={{ marginLeft: 24, color: '#999', fontSize: '12px' }}>
                    {subStep.description}
                  </div>
                }
                status="wait"
                style={{ marginLeft: 24 }}
              />
            ))}
          </React.Fragment>
        ))}
      </Steps>
    </div>
  );
};

export default MultiSteps;