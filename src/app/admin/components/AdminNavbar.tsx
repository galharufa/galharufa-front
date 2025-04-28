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
  IconSettings,
  IconSun,
  IconMoon,
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

  const menuItems = [
    {
      icon: IconUsers,
      label: 'Casting',
      link: '/admin/casting',
    },
    {
      icon: IconReceipt,
      label: 'Serviços',
      link: '/admin/servico',
    },
    {
      icon: IconNews,
      label: 'Blog',
      link: '/admin/blog',
    },
    {
      icon: IconSettings,
      label: 'Configurações',
      link: '/admin/configuracoes',
      otherLink: '/admin/usuario',
    },
  ];

  return (
    <>
      <Navbar
        fixed={true}
        width={{ base: 260 }}
        p="md"
        style={{
          borderRightColor: 'transparent',
          boxShadow:
            colorScheme === 'light'
              ? '3px 0px 15px -1px #E2E2E2'
              : '3px 0px 15px -1px #1D1C1C',
        }}
      >
        <Navbar.Section grow>
          <Center my={24}>
            <Anchor component={Link} href="/" passHref>
              <Image
                src={
                  dark
                    ? '/images/logo_horizontal_black.jpg'
                    : '/images/logo_horizontal_white.jpg'
                }
                width={150}
                height={80}
                alt="Logo"
                style={{ objectFit: 'contain' }}
                priority
              />
            </Anchor>
          </Center>

          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              icon={<item.icon size={16} stroke={1.5} />}
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
