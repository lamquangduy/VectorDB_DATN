import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAppSelector } from "@redux/hooks";
import { translate } from "@constants/lang";
import { useNavigate } from "react-router-dom";
import { NestedMenuItem } from "mui-nested-menu";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import Typography from "@mui/material/Typography/Typography";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Box from "@mui/material/Box/Box";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import TextField from "@mui/material/TextField/TextField";

const careers = [
  "Backend Developer",
  "Business Analyst",
  "Data Analysts",
  "Data Engineer",
  "Data Scientist",
  "Database Administrator",
  "Devops Engineer",
  "Frontend Developer",
  "Game Development",
  "Mobile Developer",
  "Network Engineer",
  "Software Architect",
  "Tester",
  "UX/UI Designer",
];

const skills = [
  "Platform",
  "Programming Language",
  "Framework",
  "Tools",
  "Knowledge",
];

const ExploreMenu: React.FC = () => {
  const langState = useAppSelector((state) => state.lang.langKey);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const listSkills: any = {
    Platform: [
      "AWS",
      "Azure",
      "Google Cloud",
      "IBM Cloud",
      "Oracle Cloud",
      "Salesforce",
      "SAP",
      "VMware",
    ],
    "Programming Language": [
      "C",
      "C++",
      "C#",
      "Java",
      "JavaScript",
      "Python",
      "Ruby",
      "Swift",
    ],
    Framework: [
      "Angular",
      "Django",
      "Flask",
      "Laravel",
      "React",
      "Ruby on Rails",
      "Spring",
      "Vue",
    ],
    Tools: [
      "Docker",
      "Git",
      "Jenkins",
      "Kubernetes",
      "Maven",
      "NPM",
      "Selenium",
      "Webpack",
    ],
    Knowledge: [
      "Agile",
      "CI/CD",
      "Cybersecurity",
      "Data Analysis",
      "Machine Learning",
      "Networking",
      "Quality Assurance",
      "Scrum",
    ],
  };
  return (
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <Dialog
        // onClose={() => {
        //   setOpenDetail(false);
        // }}
        open={false}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            Add more tools
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ height: 300, width: "100%" }}>
          <Box>
            <Typography>Add tools</Typography>
            <Autocomplete
              renderInput={(params) => <TextField {...params} label="Tool" />}
              options={[]}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button variant="contained">OK</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          borderWidth: "2px",
          width: 150,
          textTransform: "capitalize",
        }}
      >
        {translate("explore", langState)}
        <KeyboardArrowDownIcon />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <NestedMenuItem
          parentMenuOpen
          label={translate("Careers", langState)}
          onClick={() => {
            navigate(`/careers`);
            handleClose();
          }}
          sx={{
            width: 150,
          }}
        >
          {careers.map((career, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose();
                navigate(`/career-detail/` + career);
              }}
            >
              {translate(career, langState)}
            </MenuItem>
          ))}
        </NestedMenuItem>
        <NestedMenuItem
          parentMenuOpen
          label={translate("Skills", langState)}
          onClick={() => {
            navigate(`/search?keyword=`, {
              state: { skills: "no-selected", subSkill: "no-selected" },
            });
            handleClose();
          }}
          sx={{
            width: 150,
          }}
        >
          {skills.map((skill, index) => (
            <NestedMenuItem
              key={index}
              parentMenuOpen
              label={translate(skill, langState)}
              onClick={() => {
                navigate(`/search?keyword=`, {
                  state: {
                    skills: skill.toLowerCase(),
                    subSkill: "no-selected",
                  },
                });
                handleClose();
              }}
            >
              {listSkills[skill].map((subSkill: any, index: number) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleClose();
                    navigate(`/search?keyword=`, {
                      state: {
                        skills: skill.toLowerCase(),
                        subSkill: subSkill.toLowerCase(),
                      },
                    });
                  }}
                >
                  {subSkill}
                </MenuItem>
              ))}
            </NestedMenuItem>
          ))}
        </NestedMenuItem>
      </Menu>
    </Box>
  );
};

export default ExploreMenu;
