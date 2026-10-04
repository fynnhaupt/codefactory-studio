FROM mcr.microsoft.com/devcontainers/base:trixie

# Update and upgrade packages
RUN apt update && \
	apt upgrade -y && \
	apt install -y \
		git \
		golang

# Install asdf
RUN GOBIN=/usr/local/bin go install github.com/asdf-vm/asdf/cmd/asdf@v0.20.0

ENV ASDF_DATA_DIR=/home/vscode/.asdf
ENV PATH="/home/vscode/.asdf/shims:/usr/local/bin:${PATH}"

RUN mkdir -p /etc/zsh/completions && \
	asdf completion zsh > /etc/zsh/completions/_asdf && \
	printf '%s\n' \
		'fpath=(/etc/zsh/completions $fpath)' \
		'autoload -Uz compinit && compinit' >> /etc/zsh/zshrc

COPY --chown=vscode:vscode .tool-versions /home/vscode/.tool-versions
USER vscode
WORKDIR /home/vscode
RUN asdf plugin add nodejs && asdf install nodejs
RUN asdf plugin add pnpm && asdf install pnpm