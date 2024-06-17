import { Chip, Stack } from '@mui/material';

const CustomChip = () => {
  const fileTypes = [
    { label: 'PDF', color: '#FFCDD2' },
    // { label: 'DOC', color: '#BBDEFB' },
    { label: 'DOCX', color: '#C8E6C9' },
    { label: 'CSV', color: '#BBDEFB' },
    { label: 'XLSX', color: '#FFECB3' },
    { label: 'TXT', color: '#FFE0B2' },
  ];

  return (
    <Stack direction="row" spacing={1}>
      {fileTypes.map((file, index) => (
        <Chip
          key={index}
          label={file.label}
          style={{
            
            backgroundColor: file.color,
            color: 'black', 
            margin: '4px',
            height:24,
            marginLeft:1,
            fontSize:10
          }}
        />
      ))}
    </Stack>
  );
};

export default CustomChip;
