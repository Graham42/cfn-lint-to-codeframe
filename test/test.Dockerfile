FROM node:16-slim

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    ln -s /usr/bin/pip3 /usr/bin/pip && \
    python --version

RUN pip install cfn-lint

ENTRYPOINT ["bash"]
