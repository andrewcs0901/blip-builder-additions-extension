import Utils from "../../shared/Utils";
import { isBuilderLoaded } from "../Content";
import FeatureBase from "./FeatureBase";

export const USER_HEADER_SELECTOR = ".main-header-top:first-child";

export default class CleanEnvironment extends FeatureBase {

    private isShowingNavbar: boolean;
    private defaultNavBarHeight: number;

    public onEnableFeature(): void {
        super.onEnableFeature();
        if (isBuilderLoaded) {
            void this.startAsync();
        }
    }

    public onDisableFeature(): void {
        super.onDisableFeature();
        void this.stopAsync();
    }

    public onLoadBuilder(): void {
        void this.startAsync();
    }

    public onUnloadBuilder(): void {
        super.onUnloadBuilder();
        void this.stopAsync();
    }

    private stopAsync(): void {
        this.removeHeaderCollapser();
        this.isShowingNavbar = false;
        this.toggleMenu(false);
    }

    private startAsync(): void {
        if (!this.isEnabled || document.getElementById("addictions-cleanenv-collapser")) {
            return;
        }
        this.isShowingNavbar = false;
        void this.addHeaderCollapser();
    }

    private async addHeaderCollapser(): Promise<void> {
        const res = await fetch(Utils.getUrl("resources/collapser.html"));
        const html = await res.text();
        const icons = document.querySelector(".bot-header-details");
        const collapserContainer = document.createElement("div");
        (document.querySelector(".builder-footer") as HTMLElement).style.width = "fit-content";
        (document.querySelector(".builder-footer") as HTMLElement).style.height = "1em";
        (document.querySelector(".builder-container") as HTMLElement).style.height = "100%";
        (document.querySelector(".icon-button-list") as HTMLElement).style.top = "30vh";
        (document.querySelector(".icon-button-list") as HTMLElement).style.position = "fixed";
        this.defaultNavBarHeight = (document.querySelector(".main-navbar-content") as HTMLElement).clientHeight;

        collapserContainer.innerHTML = html;
        icons.prepend(collapserContainer);
        void Utils.sleep(20).then(() => {
            const canvas = document.getElementById("canvas");
            canvas.addEventListener("scroll", () => {
                if ((document.querySelector(".main-navbar-content") as HTMLElement).clientHeight > this.defaultNavBarHeight || this.isShowingNavbar) {
                    this.toggleMenu(true);
                    this.isShowingNavbar = false;
                }
            })
            canvas.addEventListener("mouseleave", () => {
                    this.toggleMenu(false);
                    this.isShowingNavbar = true;
            })
            window.addEventListener("scroll", () => {
                if ((document.querySelector(".main-navbar-content") as HTMLElement).clientHeight < this.defaultNavBarHeight) {
                    this.toggleMenu(false);
                    this.isShowingNavbar = true;
                }
            })
            const button = document.getElementById("addictions-cleanenv-collapser");
            button.addEventListener("click", () => {
                this.toggleMenu(this.isShowingNavbar);
                this.isShowingNavbar = !this.isShowingNavbar;
            });

        }
        );
    }

    private toggleMenu(enable: boolean) {
        const collapser = document.getElementById("addictions-cleanenv-icon");
        if (enable) {
            if (collapser) collapser.className = "icon-arrowdown";
            document.getElementById("canvas").style.height = "85vh";
            (document.querySelector(".builder-undo-redo-icons") as HTMLElement).style.display = "none";
            (document.querySelectorAll(".zoom-container").forEach(el => (el as HTMLElement).style.display = "none"));
            (document.querySelector(".main-header") as HTMLElement).classList.add("main-header-collapsed");
        } else {
            if (collapser) collapser.className = "icon-arrowup";
            document.getElementById("canvas").style.height = "calc(100vh - 165px)";
            (document.querySelector(".builder-undo-redo-icons") as HTMLElement).style.display = "block";
            (document.querySelectorAll(".zoom-container").forEach(el => (el as HTMLElement).style.display = "block"));
            (document.querySelector(".main-header") as HTMLElement).classList.remove("main-header-collapsed");
        }
    }

    private removeHeaderCollapser(): void {

        const canvas = document.getElementById("canvas");
        if (canvas) {
            canvas.style.height = "";
        }

        const container = (document.querySelector(".builder-container") as HTMLElement);
        if (container) {
            container.style.height = "";
        }

        const button = document.getElementById("addictions-cleanenv-collapser");
        if (button) {
            button.remove();
        }
    }

}
