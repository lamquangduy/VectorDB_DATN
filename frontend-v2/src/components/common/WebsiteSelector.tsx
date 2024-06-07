import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import { translate } from "@constants/lang";
import { useAppSelector } from "@redux/hooks";

interface IWebsiteSelectorProps {
  website: string;
  width?: string | number;
  onChange: (value: string) => void;
}

const WebsiteSelector: React.FC<IWebsiteSelectorProps> = ({
  website,
  onChange,
  width,
}) => {
  const langState = useAppSelector((state) => state.lang.langKey);
  return (
    <Select
      size="small"
      value={website}
      sx={{ width: width || 200 }}
      onChange={(e) => {
        onChange(e.target.value as string);
      }}
    >
      <MenuItem value="coursera">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            alt="coursera"
            src="https://149357281.v2.pressablecdn.com/wp-content/uploads/2020/12/android-chrome-512x512-1.png"
            variant="rounded"
          />
          Coursera
        </Box>
      </MenuItem>
      <MenuItem value="udemy">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            alt="udemy"
            src="https://logos-world.net/wp-content/uploads/2021/11/Udemy-Logo.png"
            variant="rounded"
          />
          Udemy
        </Box>
      </MenuItem>
      <MenuItem value="edx">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            alt="edx"
            src="https://www.edx.org/images/logos/edx-logo-elm.svg"
            variant="rounded"
          />
          Edx
        </Box>
      </MenuItem>

      <MenuItem value="all">
        <Box sx={{ display: "flex", gap: 1 }}>
          <DynamicFeedIcon sx={{ width: 24, height: 24 }}></DynamicFeedIcon>
          {translate("All", langState)}
        </Box>
      </MenuItem>
    </Select>
  );
};

export default WebsiteSelector;
