import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface Emulator {
    id: string
    name: string
    status: string
    port: number
    bootStatus: 'booting' | 'ready'
    cpu: string
    memory: string
}

// หา port ว่างอัตโนมัติ
export async function findAvailablePort(): Promise<number> {
    const { stdout } = await execAsync(
        'podman ps --filter name=android --format "{{.Ports}}"'
    )
    const usedPorts = stdout.trim().split('\n')
        .map(line => {
            const match = line.match(/(\d+)->6080/)
            return match ? parseInt(match[1]) : null
        })
        .filter(Boolean)

    let port = 6080
    while (usedPorts.includes(port)) {
        port++
    }
    return port
}


export async function listEmulators(): Promise<Emulator[]> {
    const { stdout } = await execAsync(
        'podman ps --filter name=android --format "{{.ID}}|{{.Names}}|{{.Status}}|{{.Ports}}"'
    )

    if (!stdout.trim()) return []

    const emulators = await Promise.all(
        stdout.trim().split('\n').map(async (line) => {
            const [id, name, status, ports] = line.split('|')
            const portMatch = ports?.match(/(\d+)->6080/)
            const bootStatus = await getEmulatorStatus(name)
            const stats = await getEmulatorStats(name)
            return {
                id,
                name,
                status,
                port: portMatch ? parseInt(portMatch[1]) : 0,
                bootStatus,
                ...stats
            }
        })
    )

    return emulators
}

export async function spawnEmulator(device: string, androidVersion: string) {
    const port = await findAvailablePort()
    const name = `android-${Date.now()}`
    await execAsync(
        `podman run -d -p ${port}:6080 -e EMULATOR_DEVICE="${device}" -e WEB_VNC=true --device /dev/kvm --name ${name} budtmo/docker-android:emulator_${androidVersion}`
    )
    return { name, port }
}

export async function destroyEmulator(name: string) {
    await execAsync(`podman stop ${name}`)
    await execAsync(`podman rm ${name}`)
}

export async function getEmulatorStatus(name: string): Promise<'booting' | 'ready'> {
    try {
        const { stdout } = await execAsync(
            `podman exec ${name} adb shell getprop sys.boot_completed`
        )
        return stdout.trim() === '1' ? 'ready' : 'booting'
    } catch {
        return 'booting'
    }
}

export interface EmulatorStats {
    cpu: string
    memory: string
}

export async function getEmulatorStats(name: string): Promise<EmulatorStats> {
    try {
        const { stdout } = await execAsync(
            `podman stats ${name} --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}"`
        )
        const [cpu, memory] = stdout.trim().split('|')
        return { cpu: cpu ?? '0%', memory: memory ?? '0B' }
    } catch {
        return { cpu: '0%', memory: '0B' }
    }
}