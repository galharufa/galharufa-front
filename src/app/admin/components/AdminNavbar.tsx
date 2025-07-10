'use client';

import {
  Navbar,
  NavLink,
  Anchor,
  Image,
  Center,
  Text,
  Modal,
  Title,
  Flex,
  Button,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconUsers,
  IconNews,
  IconReceipt,
  IconLogout,
  IconSun,
  IconMoon,
  IconDashboard,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useModal from '@/hooks/useModal';

import './admin-navbar.css';

export default function AdminNavbar() {
  const { logout } = useAuth();
  const logoutModal = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const closeMenu = () => {};

  // Definição do tipo para props dos ícones do Tabler
  interface TablerIconProps {
    size?: string | number;
    stroke?: string | number;
    color?: string;
    className?: string;
  }

  // Definição do tipo para items do menu
  interface MenuItem {
    icon: React.ComponentType<TablerIconProps>;
    label: string;
    link: string;
    otherLink?: string;
  }

  const menuItems: MenuItem[] = [
    {
      icon: IconDashboard,
      label: 'Dashboard',
      link: '/admin/dashboard',
    },
    {
      icon: IconUsers,
      label: 'Casting',
      link: '/admin/casting',
    },
    {
      icon: IconReceipt,
      label: 'Serviços',
      link: '/admin/servicos',
    },
    {
      icon: IconNews,
      label: 'Bureau Cultural',
      link: '/admin/blog',
    },
  ];

  return (
    <>
      <Navbar
        // fixed={true}
        width={{ base: 260 }}
        p="md"
        style={{
          borderRightColor: 'transparent',
          boxShadow:
            colorScheme === 'light'
              ? '3px 0px 15px -1px #E2E2E2'
              : '3px 0px 15px -1px #1D1C1C',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Navbar.Section grow>
          <Center my={24}>
            <Anchor component={Link} href="/admin/dashboard" passHref>
              <Image
                src={
                  dark
                    ? '/images/logos/logo_horizontal_black.jpg'
                    : '/images/logos/logo_horizontal_white.jpg'
                }
                width={230}
                height={100}
                alt="Logo"
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  margin: '0 auto',
                }}
                fit="contain"
              />
            </Anchor>
          </Center>

          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              icon={<item.icon size="16" stroke="1.5" />}
              variant="filled"
              className="admin-nav-link"
              active={
                pathname?.includes(item.link) ||
                (!!item.otherLink && pathname?.includes(item.otherLink))
              }
              onClick={() => {
                closeMenu();
                router.push(item.link);
              }}
            />
          ))}
        </Navbar.Section>

        <Navbar.Section>
          <Flex justify="space-between" align="center" mb="xs">
            <Text size="xs" color="dimmed">
              Tema
            </Text>
            <Tooltip label={dark ? 'Modo claro' : 'Modo escuro'}>
              <ActionIcon
                variant="outline"
                onClick={() => toggleColorScheme()}
                title="Alternar tema"
                sx={{
                  color: dark ? '#FFFFFF !important' : '#000000 !important',
                  borderColor: dark ? '#FFFFFF !important' : '#000000 !important',
                  '&:hover': {
                    backgroundColor: dark
                      ? 'rgba(255, 255, 255, 0.1) !important'
                      : 'rgba(0, 0, 0, 0.1) !important',
                  },
                }}
              >
                {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
          </Flex>

          <NavLink
            label={<Text c="red">Logout</Text>}
            icon={<IconLogout size={16} stroke={1.5} color="red" />}
            color={'red'}
            className="admin-nav-link"
            onClick={logoutModal.open}
          />
        </Navbar.Section>
      </Navbar>

      <Modal
        size="auto"
        centered
        opened={logoutModal.isOpen}
        onClose={logoutModal.close}
        withCloseButton={false}
      >
        <Title order={4} align="center">
          Tem certeza que deseja sair?
        </Title>

        <Flex mt={36} align="center" justify="center" gap="xl" direction="row">
          <Button type="button" color="gray" w={200} onClick={logoutModal.close}>
            Cancelar
          </Button>

          <Button type="button" variant="outline" color="red" w={200} onClick={logout}>
            Logout
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
