// Views
import DashboardView from '../views/DashboardView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import LoginLayout from '../layouts/LoginLayout.vue'
import LoginView from '../views/LoginView.vue'
import ProdutosView from '../views/ProdutosView.vue'
import PedidosView from '../views/PedidosView.vue'
import ClientesView from '../views/ClientesView.vue'
import FornecedoresView from '../views/FornecedoresView.vue'
import ComprasView from '../views/ComprasView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '',
    name: 'MainLayout',
    component: MainLayout,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
          title: 'Dashboard',
          requireAuth: true
        }
      },
      {
        path: '/produtos',
        name: 'Produtos',
        component: ProdutosView,
        meta: {
          title: 'Produtos',
          requireAuth: true
        }
      },
      {
        path: '/vendas',
        name: 'Vendas',
        component: PedidosView,
        meta: {
          title: 'Vendas',
          requireAuth: true
        }
      },
      {
        path: '/clientes',
        name: 'Clientes',
        component: ClientesView,
        meta: {
          title: 'Clientes',
          requireAuth: true
        }
      },
      {
        path: '/fornecedores',
        name: 'Fornecedores',
        component: FornecedoresView,
        meta: {
          title: 'Fornecedores',
          requireAuth: true
        }
      },
      {
        path: '/compras',
        name: 'Compras',
        component: ComprasView,
        meta: {
          title: 'Compras',
          requireAuth: true
        }
      },
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: UsuariosView,
        meta: {
          title: 'Usuarios',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: LoginLayout,
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginView,
        meta: {
          title: 'Login'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: {
      title: 'Not Found'
    }
  }
]

export default routes
