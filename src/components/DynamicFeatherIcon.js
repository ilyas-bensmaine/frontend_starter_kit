import React from 'react';
import * as FeatherIcons from 'react-feather';

const DynamicFeatherIcon = ({ iconName, size, color }) => {
  // Convert the iconName prop to title case (e.g., 'activity' to 'Activity')
  const IconComponent = FeatherIcons[iconName];

  if (IconComponent) {
    // Create a style object to apply size and color
    const iconStyle = {
      fontSize: size || '24px',
      color: color || '',
    };

    return <IconComponent style={iconStyle} />;
  } else {
    return <FeatherIcons.AlertCircle style={iconStyle}/>;
  }
};

export default DynamicFeatherIcon;
