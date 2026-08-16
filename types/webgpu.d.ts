interface Navigator {
  readonly gpu?: GPU;
}

interface GPU {
  requestAdapter(options?: { powerPreference?: "low-power" | "high-performance" }): Promise<GPUAdapter | null>;
}

interface GPUAdapter {
  requestDevice(): Promise<GPUDevice>;
}

interface GPUDevice {
  readonly queue: GPUQueue;
  createBuffer(descriptor: { size: number; usage: number }): GPUBuffer;
  createShaderModule(descriptor: { code: string }): GPUShaderModule;
  createComputePipelineAsync(descriptor: {
    layout: "auto";
    compute: { module: GPUShaderModule; entryPoint: string };
  }): Promise<GPUComputePipeline>;
  createBindGroup(descriptor: {
    layout: unknown;
    entries: Array<{ binding: number; resource: { buffer: GPUBuffer } }>;
  }): unknown;
  createCommandEncoder(): GPUCommandEncoder;
}

interface GPUQueue {
  writeBuffer(buffer: GPUBuffer, offset: number, data: ArrayBufferView): void;
  submit(commands: unknown[]): void;
}

interface GPUBuffer {
  mapAsync(mode: number): Promise<void>;
  getMappedRange(): ArrayBuffer;
  unmap(): void;
  destroy(): void;
}

interface GPUShaderModule {
  readonly __gpuShaderModuleBrand?: "GPUShaderModule";
}

interface GPUComputePipeline {
  getBindGroupLayout(index: number): unknown;
}

interface GPUCommandEncoder {
  beginComputePass(): GPUComputePassEncoder;
  copyBufferToBuffer(source: GPUBuffer, sourceOffset: number, destination: GPUBuffer, destinationOffset: number, size: number): void;
  finish(): unknown;
}

interface GPUComputePassEncoder {
  setPipeline(pipeline: GPUComputePipeline): void;
  setBindGroup(index: number, bindGroup: unknown): void;
  dispatchWorkgroups(count: number): void;
  end(): void;
}

declare const GPUBufferUsage: {
  MAP_READ: number;
  COPY_SRC: number;
  COPY_DST: number;
  UNIFORM: number;
  STORAGE: number;
};

declare const GPUMapMode: { READ: number };
