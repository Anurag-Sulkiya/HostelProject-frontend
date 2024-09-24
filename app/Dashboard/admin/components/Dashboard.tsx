// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Button,
//   Box,
//   CssBaseline,
// } from "@mui/material";
// import {
//   Dashboard as DashboardIcon,
//   Group as StudentsIcon,
//   Business as HostelsIcon,
//   Assignment as TasksIcon,
//   Logout as LogoutIcon,
//   Person as OwnerIcon,
//   Security as UACIcon,
// } from "@mui/icons-material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faBuilding,
//   faCheckCircle,
//   faClock,
//   faList,
//   faThumbsUp,
// } from "@fortawesome/free-solid-svg-icons";
// import Students from "./components/Students";
// import Hostels from "./components/Hostels";
// import Owners from "./components/Owners";
// import Page from "../uac/Page";
// import Tasks from "./components/Tasks";
// import PieChart from "../components/PieChart";
// import OccupancyCard from "../components/OccupancyCard";
// import DataGalaxyLoader from "./DataGalaxyLoader";

// const drawerWidth = 240;

// const sidebarItems = [
//   { name: "Dashboard", icon: <DashboardIcon />, value: "dashboard" },
//   { name: "Students", icon: <StudentsIcon />, value: "students" },
//   { name: "Hostel Owners", icon: <OwnerIcon />, value: "owners" },
//   { name: "Hostels", icon: <HostelsIcon />, value: "hostels" },
//   { name: "UAC", icon: <UACIcon />, value: "uac" },
//   { name: "Tasks", icon: <TasksIcon />, value: "tasks" },
// ];

// const ChartCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <div className="bg-gray-800 p-6 rounded-lg text-white shadow-[0_0_10px_rgba(0,0,255,0.5),0_0_20px_rgba(0,0,0,0.3)] transition duration-300 ease-in-out h-64">
//       {children}
//     </div>
//   );
// };

// const AdminDashboard: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [activePage, setActivePage] = useState<string>("dashboard");
//   const [adminName, setAdminName] = useState<string>("Admin User");
//   const [studentsCount, setStudentsCount] = useState<number>(0);
//   const [ownersCount, setOwnersCount] = useState<number>(0);
//   const [hostelsCount, setHostelsCount] = useState<number>(0);
//   const [approvedHostelsCount, setApprovedHostelsCount] = useState<number>(0);
//   const [approvedWishlistCount, setApprovedWishlistCount] = useState<number>(0);
//   const [pendingWishlistCount, setPendingWishlistCount] = useState<number>(0);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       window.location.href = "/login"; // Redirect to login page if no token
//       return;
//     }

//     setIsAuthenticated(true);

//     const fetchData = async () => {
//       try {
//         const [studentsRes, ownersRes, hostelsRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/admin/students", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:5000/api/admin/owners", {
//             headers: { Authorization: `Bearer ${token} ` },
//           }),
//           axios.get("http://localhost:5000/api/admin/hostels", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const students = studentsRes.data;
//         setStudentsCount(students.length);
//         setOwnersCount(ownersRes.data.length);
//         setHostelsCount(hostelsRes.data.length);

//         // Calculate approved and pending wishlists
//         let approvedCount = 0;
//         let pendingCount = 0;

//         students.forEach((student: any) => {
//           if (student.wishlist && student.wishlist.length > 0) {
//             if (student.wishlistApproved === "true") {
//               approvedCount++;
//             } else {
//               pendingCount++;
//             }
//           }
//         });

//         setApprovedWishlistCount(approvedCount);
//         setPendingWishlistCount(pendingCount);

//         // Filter for approved hostels
//         const verifiedHostels = hostelsRes.data.filter(
//           (hostel: any) => hostel.verified
//         );

//         setApprovedHostelsCount(verifiedHostels.length);

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token from local storage
//     window.location.href = "/login"; // Redirect to login page
//   };

//   if (!isAuthenticated) {
//     return null; // Or display a loading spinner or message if desired
//   }

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           bgcolor: "#1a202c",
//           color: "white",
//           minHeight: "100vh",
//         }}
//       >
//         <CssBaseline />
//         <AppBar
//           position="fixed"
//           sx={{
//             zIndex: (theme) => theme.zIndex.drawer + 1,
//             bgcolor: "#2d3748",
//           }}
//         >
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ fontWeight: "bold" }}
//             >
//               Admin Dashboard
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Avatar sx={{ mr: 2, bgcolor: "#4A90E2" }}>
//                 {adminName.charAt(0)}
//               </Avatar>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mr: 2, fontWeight: "medium" }}
//               >
//                 {adminName}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<LogoutIcon />}
//                 onClick={handleLogout}
//                 sx={{
//                   bgcolor: "#4A90E2",
//                   "&:hover": { bgcolor: "#3A78C2" },
//                   textTransform: "none",
//                   borderRadius: "20px",
//                 }}
//               >
//                 Logout
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>
//         <Drawer
//           variant="permanent"
//           sx={{
//             width: drawerWidth,
//             flexShrink: 0,
//             [`& .MuiDrawer-paper`]: {
//               width: drawerWidth,
//               boxSizing: "border-box",
//               bgcolor: "#2d3748",
//               color: "white",
//               borderRight: "none",
//               margin: 2,
//               borderRadius: "20px",
//               padding: "10px",
//               marginTop: "74px",
//             },
//           }}
//         >
//           <Toolbar />
//           <Box sx={{ overflow: "auto", my: 1, mx: 1 }}>
//             <List>
//               {sidebarItems.map((item) => (
//                 <ListItem
//                   disablePadding
//                   component="button"
//                   key={item.name}
//                   onClick={() => setActivePage(item.value)}
//                   sx={{
//                     mb: 1,
//                     borderRadius: "10px",
//                     bgcolor:
//                       activePage === item.value ? "#4A90E2" : "transparent",
//                     "&:hover": {
//                       bgcolor:
//                         activePage === item.value
//                           ? "#4A90E2"
//                           : "rgba(74, 144, 226, 0.1)",
//                     },
//                     transition: "background-color 0.3s",
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       color: activePage === item.value ? "white" : "#4A90E2",
//                       minWidth: "40px",
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.name}
//                     primaryTypographyProps={{
//                       fontWeight: activePage === item.value ? "bold" : "medium",
//                       fontSize: activePage === item.value ? "1rem" : "0.875rem",
//                     }}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         </Drawer>
//         <Box
//           component="main"
//           sx={{ flexGrow: 1, p: 3, mt: { xs: 8, sm: 9 }, ml: { xs: 2, sm: 3 } }}
//         >
//           <div className="p-8 relative min-h-screen bg-gray-900 overflow-hidden">
//             {isLoading ? (
//               <DataGalaxyLoader />
//             ) : (
//               <>
//                 {activePage === "dashboard" && (
//                   <>
//                     {" "}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                       <OccupancyCard
//                         title="No. of students"
//                         icon={faUser}
//                         color="#00ffff"
//                         totalNumber={studentsCount} // Use the fetched number
//                       />
//                       <OccupancyCard
//                         title="No. of owners"
//                         icon={faBuilding}
//                         color="#ffff00"
//                         totalNumber={ownersCount} // Use the fetched number
//                       />
//                       <OccupancyCard
//                         title="Approved Hostels"
//                         icon={faCheckCircle}
//                         color="#ff00ff"
//                         totalNumber={approvedHostelsCount} // Use the fetched number
//                       />
//                       <OccupancyCard
//                         title="Pending Wishlist"
//                         icon={faClock}
//                         color="#ff00ff"
//                         totalNumber={pendingWishlistCount} // Use the fetched number
//                       />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
//                       <OccupancyCard
//                         title="No. of Hostels"
//                         icon={faList}
//                         color="#ffff00"
//                         totalNumber={hostelsCount} // Use the fetched number
//                       />
//                       <OccupancyCard
//                         title="Approved Wishlist"
//                         icon={faThumbsUp}
//                         color="#00ffff"
//                         totalNumber={approvedWishlistCount} // Use the fetched number
//                       />
//                       <ChartCard>
//                         <PieChart
//                           studentsCount={studentsCount}
//                           ownersCount={ownersCount}
//                         />
//                       </ChartCard>
//                     </div>
//                   </>
//                 )}
//                 {activePage === "students" && <Students />}
//                 {activePage === "hostels" && <Hostels />}
//                 {activePage === "owners" && <Owners />}
//                 {activePage === "tasks" && <Tasks />}
//                 {activePage === "uac" && <Page />}
//               </>
//             )}
//           </div>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default AdminDashboard;
