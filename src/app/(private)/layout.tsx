"use client";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import logo from "~/public/images/small-logo.jpg";
import { FC, ReactNode, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { deepOrange } from "@mui/material/colors";
import MenuList from "~/components/MenuList";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { request } from "~/ultis/helper/request";
import { useAppDispatch, useAppSelector } from "~/hooks/hooks";
import { setUserInfo } from "~/ultis/slices/userSlice";

const drawerWidth = 310;

const Header = styled("header", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#FFFFFF",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: "#FFFFFF",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(0),
      },
    }),
  },
}));

const mdTheme = createTheme();

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((s) => s.user);
  const [open, setOpen] = useState(false);

  const { push } = useRouter();
  const pathname = usePathname();

  const title = useMemo(() => {
    if (pathname.split("/")[1]) {
      if (pathname.split("/")[1] == "invoices") {
        return "DOCUMENTS";
      }

      return pathname.split("/")[1].toUpperCase();
    } else {
      return "DASHBOARD";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const shortName = useMemo(
    () => userInfo?.firstname?.slice(0, 2) || "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userInfo]
  );

  useEffect(() => {
    console.log("call API");

    request("/user/info", {
      method: "post",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        dispatch(setUserInfo(res.data));
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMenu() {
    setOpen(!open);
  }

  function handleSignOut() {
    Cookies.remove("token");
    push("/signin");
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header className="fixed h-16 w-full bg-grey-darker shadow flex items-center">
          <Box className="flex justify-between items-center gap-x-3 w-[310px] bg-[#FFFFFF] p-[0_15px] h-[inherit] border-solid border-y-0 border-r-[1px] border-[#e4e4e4]">
            <Link
              className="flex flex-row justify-center items-center no-underline text-[#000]"
              href="/"
            >
              <Box className="flex items-center">
                <Image
                  src={logo}
                  objectFit="contain"
                  fill
                  priority
                  className="!static !h-16"
                  alt="logo"
                />
              </Box>
              <Typography
                component="h1"
                variant="h6"
                color="#00000"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Sumitomo Chemical
              </Typography>
            </Link>
            {open ? (
              <KeyboardDoubleArrowLeftIcon
                onClick={toggleMenu}
                className={"cursor-pointer"}
              />
            ) : (
              <KeyboardDoubleArrowRightIcon
                onClick={toggleMenu}
                className={"cursor-pointer"}
              />
            )}
          </Box>
          <Box className="p-[0_20px] flex justify-between">
            <Typography
              component="h1"
              variant="h6"
              color="#000000"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title.split("-").join(" ")}
            </Typography>
          </Box>
        </Header>
        <Drawer variant="permanent" open={open} style={{ minHeight: "100vh" }}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          ></Toolbar>
          <Box
            className={"flex flex-row items-center gap-[20px] py-3 px-4 w-full"}
          >
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {shortName.toUpperCase()}
            </Avatar>
            <Box className="flex flex-col">
              <Typography variant="body1">
                {userInfo && `${userInfo?.firstname} ${userInfo?.lastname}`}
              </Typography>
              <Typography variant="body2" color={"#7e8299"}>
                {userInfo && `${userInfo?.email}`}
              </Typography>
              <Typography
                variant="caption"
                color={"#7e8299"}
                className="underline cursor-pointer"
                onClick={handleSignOut}
              >
                Sign out
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box className={"flex flex-col justify-between h-full"}>
            <Box>
              <MenuList />
            </Box>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            paddingTop: "25px",
          }}
        >
          <Toolbar className="bg-[#fff]" />
          <Box className={"px-4 min-h-[100%] bg-[#fff]"}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
