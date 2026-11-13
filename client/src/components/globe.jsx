import IconCloud from "./ui/icon-cloud";
import {
  siTypescript,
  siJavascript,
  siDart,
  siReact,
  siFlutter,
  siAndroid,
  siHtml5,
  siCss,
  siNodedotjs,
  siExpress,
  siNextdotjs,
  siPrisma,
  siPostgresql,
  siFirebase,
  siNginx,
  siVercel,
  siTestinglibrary,
  siJest,
  siCypress,
  siDocker,
  siGit,
  siJira,
  siGithub,
  siGitlab,
  siAndroidstudio,
  siSonarqubeserver,
  siFigma,
} from "simple-icons";

// Bundled from the simple-icons package rather than fetched at runtime — the
// react-icon-cloud fetcher points at a simple-icons data URL that no longer exists.
// Java, AWS and VS Code are no longer in simple-icons (removed at the brands' request).
const icons = [
  siTypescript,
  siJavascript,
  siDart,
  siReact,
  siFlutter,
  siAndroid,
  siHtml5,
  siCss,
  siNodedotjs,
  siExpress,
  siNextdotjs,
  siPrisma,
  siPostgresql,
  siFirebase,
  siNginx,
  siVercel,
  siTestinglibrary,
  siJest,
  siCypress,
  siDocker,
  siGit,
  siJira,
  siGithub,
  siGitlab,
  siAndroidstudio,
  siSonarqubeserver,
  siFigma,
];

function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg  px-20 pb-20 pt-8 bg-transparent">
      <IconCloud icons={icons} />
    </div>
  );
}

export default IconCloudDemo;
