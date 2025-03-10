import * as FaIcons from "react-icons/fa"; // FontAwesome Icons
import * as AiIcons from "react-icons/ai"; // Ant Design Icons
import * as BiIcons from "react-icons/bi"; // Bootstrap Icons
import * as MdIcons from "react-icons/md"; // Material Icons

const iconSets = {
  fa: FaIcons, // FontAwesome
  ai: AiIcons, // Ant Design
  bi: BiIcons, // Bootstrap Icons
  md: MdIcons, // Material Icons
};

const Icon = ({ name, className = "text-3xl text-blue-500" }) => {
  if (!name) return null;

  const [prefix, ...iconParts] = name.split("-"); // Extract prefix (fa, ai, etc.) and remaining parts
  const iconSet = iconSets[prefix]; // Get the correct icon set
  
  if (!iconSet) return <p className="text-red-500">Invalid icon prefix</p>;

  // Convert to PascalCase (fa-user -> FaUser)
  const iconName = (prefix.charAt(0).toUpperCase() + prefix.slice(1)) + iconParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("");
 
  const IconComponent = iconSet[iconName]; // Fetch the icon dynamically

  if (!IconComponent) return <p className="text-red-500">Icon not found</p>;

  return <IconComponent className={className} />;
};

export default Icon;
