import { h, TransitionGroup, Teleport, ref, defineComponent } from "vue";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/solid";

const toasts = ref([]);

const removeToast = (toast) => {
  toast.visible = false;
  const index = toasts.value.indexOf(toast);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
  toasts.value.forEach((toast, index) => {
    toast.top = index + 1;
  });
};

/**
 * Shows a toast with the given parameters. Defaults are provided.
 * @param {Object} options - Contains properties for the toast.
 * @property {string} options.message - The message to display. Default is an empty string.
 * @property {string} [options.type='info'] - The type of toast (info, success, error, warning).
 * @property {string} [options.color='#1c5ca4'] - Background color of the toast.
 * @property {Function} [options.icon=InformationCircleIcon] - Icon for the toast.
 * @property {string} [options.iconColor='#FFFFFF'] - Color of the toast icon.
 * @property {number} [options.delay=3000] - Time (in ms) after which the toast disappears.
 */

const showToast = ({
  message = "",
  type = null,
  color = "#1c5ca4",
  icon = InformationCircleIcon,
  iconColor = "#FFFFFF",
  delay = 3000,
}) => {
  if (toasts.value.length > 14) return;

  switch (type) {
    case "success":
      color = "#84cc16";
      icon = CheckCircleIcon;
      break;
    case "error":
      color = "#dc2626";
      icon = ExclamationCircleIcon;
      break;
    case "warning":
      color = "#fbbf24";
      icon = ExclamationTriangleIcon;
      break;
    default:
      break;
  }

  const toast = {
    id: Date.now(),
    message,
    color,
    visible: true,
    top: toasts.value.length + 1,
    icon,
    iconColor,
  };

  toasts.value.push(toast);

  setTimeout(() => {
    removeToast(toast);
  }, delay);
};

/**
 * ToastGlobal Component.
 * Renders toast notifications globally.
 */
const ToastGlobal = defineComponent({
  setup() {
    return { toasts };
  },
  render(props) {
    return h(Teleport, { to: "body" }, [
      h(
        TransitionGroup,
        {
          enterActiveClass: "duration-300 ease-out",
          enterFromClass: "transform opacity-0 scale-95 -translate-x-12",
          enterToClass: "opacity-100 scale-100",
          leaveActiveClass: "duration-200 ease-in",
          leaveFromClass: "opacity-100 scale-100",
          leaveToClass: "transform opacity-0 scale-95",
        },
        {
          default: () =>
            props.toasts.map((toast) =>
              h(
                "div",
                {
                  key: toast.id,
                  class:
                    "fixed flex mx-4 rounded-[4px] min-w-[100px] w-fit h-14 text-white z-[9999] transition-all duration-200",
                  style: {
                    top: 1 + (toast.top - 1) * 4 + "rem",
                    backgroundColor: toast.color,
                  },
                  onClick: () => {
                    removeToast(toast);
                  },
                },
                [
                  h(toast.icon, {
                    class:
                      "my-auto w-10 mx-2 stroke-2 font-extrabold rounded-full",
                    style: {
                      color: toast.iconColor,
                    },
                  }),
                  h(
                    "span",
                    {
                      class: "my-auto pr-4 font-semibold",
                    },
                    toast.message
                  ),
                ]
              )
            ),
        }
      ),
    ]);
  },
});

export default ToastGlobal;
export { showToast };
