import { useMemo, useState } from "react";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";

import "./style.css";
import Icons from "../Icons";
import Link from "next/link";

const listItems: ItemProps[] = [
  {
    icon: "dashboard",
    label: "Invoices",
    url: "/invoices",
  },
  // {
  //   icon: 'dashboard',
  //   label: 'SESAMi Invoices',
  //   url: '/invoices-sesami',
  // },
  {
    icon: "people",
    label: "Users",
    url: "/users",
  },
  {
    icon: "company",
    label: "Companies",
    url: "/companies",
  },
  {
    icon: "log",
    label: "Logs",
    url: "/log",
  },
  {
    icon: "upload",
    label: "Upload Documents",
    url: "/upload",
  },
];

interface ItemProps {
  icon: string;
  url: string;
  label: string;
  children?: ItemProps[];
}

const Item = (props: ItemProps) => {
  const icon = useMemo(() => {
    return <Icons name={props.icon} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListItemButton component={Link} href={props.url}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={props.label} />
    </ListItemButton>
  );
};

const MenuList = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const renderChild = (item: any) => {
    return (
      <List component="nav" className="relative">
        {item.children ? (
          <>
            <div>
              <Link href={item.url}>
                <ListItemButton>
                  <ListItemIcon>
                    <Icons name={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
              <div
                className="absolute top-5 right-2 cursor-pointer"
                onClick={handleClick}
              >
                {open ? (
                  <Icons name="expandLess" />
                ) : (
                  <Icons name="expandMore" />
                )}
              </div>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children ? (
                  item.children.map((el: any) => renderChild({ ...el }))
                ) : (
                  <Item
                    key={item.label + item.url}
                    icon={item.icon}
                    label={item.label}
                    url={item.url}
                  />
                )}
              </List>
            </Collapse>
          </>
        ) : (
          <Item key={item.label + item.url} {...item} />
        )}
      </List>
    );
  };

  const listItemsRender = listItems.map((item) => {
    if (item?.children) {
      return renderChild({ ...item });
    }
    return <Item key={item.label + item.url} {...item} />;
  });
  return <List component="nav">{listItemsRender}</List>;
};

export default MenuList;
