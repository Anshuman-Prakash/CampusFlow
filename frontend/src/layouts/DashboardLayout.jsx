import { useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SmartToy,
  Description,
  EventNote,
  InsertChart,
  School,
  Work,
  Event,
  Analytics,
  Menu as MenuIcon,
  Settings,
  Logout,
  MoreVert,
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import ErrorBoundary from '../components/ErrorBoundary';

const DRAWER_WIDTH = 240;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'AI Assistant', icon: <SmartToy />, path: '/dashboard/ai-assistant' },
    { text: 'Notices', icon: <Description />, path: '/dashboard/notice-summarizer' },
    { text: 'Planner', icon: <EventNote />, path: '/dashboard/daily-planner' },
    { text: 'Attendance', icon: <InsertChart />, path: '/dashboard/attendance' },
    { text: 'Knowledge', icon: <School />, path: '/dashboard/knowledge-base' },
    { text: 'Placement', icon: <Work />, path: '/dashboard/placement' },
    { text: 'Events', icon: <Event />, path: '/dashboard/events' },
    { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analytics' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getFirstName = () => {
    if (user?.fullName) return user.fullName.split(' ')[0];
    if (user?.name) return user.name.split(' ')[0];
    return 'Student';
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Logo Section - More compact and professional */}
      <Box 
        sx={{ 
          p: 2.5,
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 8px rgba(102, 126, 234, 0.3)',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/assets/logo.png"
            alt="CampusFlow"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback if logo image doesn't exist
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span style="color: #ffffff; font-size: 16px; font-weight: 700;">CF</span>';
            }}
          />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: '#1a1a1a',
            fontSize: '18px',
            letterSpacing: '-0.3px',
          }}
        >
          CampusFlow
        </Typography>
      </Box>

      {/* Menu Items - Professional spacing and styling */}
      <Box sx={{ flexGrow: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  py: 1.25,
                  px: 1.5,
                  minHeight: 44,
                  transition: 'all 120ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b3f94 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #667eea',
                    outlineOffset: '2px',
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 36, 
                    color: isSelected ? '#ffffff' : '#666666',
                    '& svg': {
                      fontSize: '20px',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: isSelected ? 600 : 500,
                    letterSpacing: '-0.1px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Box>

      {/* User Profile - Premium card design */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'all 120ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#f8f8f8',
              borderColor: 'rgba(102, 126, 234, 0.3)',
              transform: 'translateY(-1px)',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            },
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              width: 38,
              height: 38,
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0px 2px 6px rgba(102, 126, 234, 0.3)',
            }}
          >
            {getFirstName().charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: '#1a1a1a',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '-0.1px',
              }}
            >
              {getFirstName()}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#999999',
                fontSize: '12px',
                letterSpacing: '-0.05px',
              }}
            >
              View profile
            </Typography>
          </Box>
          <MoreVert sx={{ fontSize: 18, color: '#999999' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Side Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: '#fafafa',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: '#fafafa',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Mobile Menu Button - Floating */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: '#f4f4f4',
          },
        }}
      >
        <MenuIcon sx={{ color: '#333333' }} />
      </IconButton>

      {/* Main Content Area - No navbar overlap */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: '#f4f4f4',
          minHeight: '100vh',
        }}
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '60vh',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '8px',
            minWidth: 180,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(51, 51, 51, 0.12)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: '#333333' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: '#333333' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
