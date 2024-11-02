import {
    BsShop,
    BsPersonVideo2,
    BsBoxSeam,
    BsAlignBottom,
    BsTags,
    BsPalette2,
    BsPinFill,
    BsCashStack,
    BsListCheck,
    BsJournalCheck,
    BsJournalText,
    BsCalendar2Check,
    BsBarChartFill,
    BsPcDisplayHorizontal,
    BsGraphUp,
} from 'react-icons/bs'
import { SettingOutlined, ShoppingOutlined } from '@ant-design/icons'

export const menuData = [
    {
        key: 0,
        title: 'Plataforma',
        icon: <ShoppingOutlined />,
        path: '/admin'
    },
    {
        key: 1,
        title: 'Sucursales',
        icon: <BsShop />,
        path: '/admin/branches'
    },
    {
        key: 2,
        title: 'Clientes',
        icon: <BsPersonVideo2 />,
        path: '/admin/clients'
    },
    {
        key: 3,
        title: 'Gestion de Telas',
        icon: <BsBoxSeam />,
        children: [
            {
                key: 31,
                title: 'Telas',
                icon: <BsAlignBottom />,
                path: '/admin/fabrics'
            },
            {
                key: 4,
                title: 'Proovedores',
                icon: <BsTags />,
                path: '/admin/suppliers'
            },
            {
                key: 6,
                title: 'Categorias',
                icon: <BsPinFill />,
                path: '/admin/categories'
            },
            {
                key: 7,
                title: 'Promociones',
                icon: <BsTags />,
                path: '/admin/promos'
            },
        ],
    },
    {
        key: 11,
        title: 'Transacciones',
        icon: <BsCashStack />,
        children: [
            {
                key: 8,
                title: 'Pedidos',
                icon: <BsListCheck />,
                path: '/admin/orders'
            },
            {
                key: 9,
                title: 'Ventas',
                icon: <BsJournalCheck />,
                path: '/admin/sales'
            },
            {
                key: 10,
                title: 'Cotizaciones',
                icon: <BsJournalText />,
                path: '/admin/cotizaciones'
            },
            {
                key: 111,
                title: 'Reservas',
                icon: <BsCalendar2Check />,
                path: '/admin/booking'
            },
        ],
    },
    {
        key: 12,
        title: 'Ventas por producto',
        icon: <BsBarChartFill />,
        path: '/admin/sales/products'
    },
    {
        key: 13,
        title: 'Cajas',
        icon: <BsPcDisplayHorizontal />,
        path: '/admin/sales/boxes'
    },
    {
        key: 14,
        title: 'Reportes',
        icon: <BsGraphUp />,
        path: '/admin/reports'
    },
    {
        key: 15,
        title: 'Configuracion de empresa',
        icon: <SettingOutlined />,
        path: '/admin/config'
    },
];