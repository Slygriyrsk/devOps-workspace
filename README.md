# 🚀 Cyber DevOps Command Center

A **premium hacker-style DevOps workspace** built with Next.js, featuring real-time monitoring, interactive terminal, Docker management, Git workflow visualization, and CI/CD pipeline simulation.

![DevOps Workspace](https://img.shields.io/badge/DevOps-Workspace-green?style=for-the-badge&logo=docker)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)

## 🎯 What is this Project?

This is a **cyberpunk-themed DevOps dashboard** that provides a centralized command center for managing development operations. It combines the aesthetics of hacker interfaces with practical DevOps tools, creating an immersive experience for developers and system administrators.

### 🌟 Key Features

- **🖥️ Interactive Hacker Terminal** - Execute real commands with cyberpunk aesthetics
- **🐳 Docker Container Management** - Monitor and control Docker containers
- **🌿 Git Workflow Visualization** - Track branches, commits, and repository status
- **🔄 CI/CD Pipeline Matrix** - Simulate and monitor deployment pipelines
- **📊 System Monitoring** - Real-time CPU, memory, and network statistics
- **🗄️ Database Vault** - MongoDB Atlas integration and monitoring
- **🎨 Matrix Rain Effects** - Animated background with binary streams
- **🔊 Cyberpunk Sound Effects** - Audio feedback for terminal interactions

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side functionality
- **Node.js** - Runtime environment
- **MongoDB Atlas** - Cloud database
- **Docker API** - Container management
- **Git CLI** - Version control integration

### DevOps Tools
- **Docker Desktop** - Container platform
- **Git** - Version control system
- **MongoDB Atlas** - Database service
- **Vercel** - Deployment platform

## 📁 Project Structure

```
devops-workspace/
├── 📁 app/
│   ├── 📁 api/
│   │   ├── 📁 database/
│   │   │   └── 📄 status/route.ts          # MongoDB connection & stats
│   │   ├── 📁 docker/
│   │   │   └── 📄 containers/route.ts      # Docker container management
│   │   ├── 📁 git/
│   │   │   ├── 📄 branches/route.ts        # Git branch information
│   │   │   ├── 📄 commits/route.ts         # Git commit history
│   │   │   └── 📄 status/route.ts          # Git repository status
│   │   ├── 📁 system/
│   │   │   └── 📄 status/route.ts          # System monitoring
│   │   └── 📁 terminal/
│   │       └── 📄 execute/route.ts         # Terminal command execution
│   ├── 📄 globals.css                      # Global styles
│   ├── 📄 layout.tsx                       # Root layout
│   └── 📄 page.tsx                         # Main dashboard
├── 📁 components/
│   ├── 📁 dashboard/
│   │   ├── 📄 cicd-pipeline.tsx            # CI/CD Pipeline Matrix
│   │   ├── 📄 database-monitor.tsx         # MongoDB monitoring
│   │   ├── 📄 docker-manager.tsx           # Docker container grid
│   │   ├── 📄 git-workflow.tsx             # Git visualization
│   │   ├── 📄 hacker-terminal.tsx          # Interactive terminal
│   │   └── 📄 system-monitor.tsx           # System stats
│   └── 📁 ui/
│       ├── 📄 binary-stream.tsx            # Animated binary effects
│       ├── 📄 glitch-text.tsx              # Text glitch animations
│       └── 📄 matrix-rain.tsx              # Matrix rain background
├── 📁 hooks/
│   ├── 📄 use-docker-data.ts               # Docker data fetching
│   ├── 📄 use-git-data.ts                  # Git data fetching
│   ├── 📄 use-sound.ts                     # Audio effects
│   ├── 📄 use-system-stats.ts              # System monitoring
│   └── 📄 use-websocket.ts                 # WebSocket connections
├── 📁 lib/
│   └── 📄 mongodb.ts                       # MongoDB connection
├── 📁 public/
│   └── 📁 sounds/                          # Audio assets (optional)
├── 📄 .env.local                           # Environment variables
├── 📄 package.json                         # Dependencies
└── 📄 README.md                            # This file
```

## 🎮 Dashboard Components

### 1. 🖥️ **Cyber Terminal**
Interactive command-line interface with hacker aesthetics.

**Features:**
- Real command execution
- Command history (↑↓ arrows)
- Cyberpunk sound effects
- Matrix rain background
- Glitch text effects

### 2. 📊 **System Monitor**
Real-time system statistics display.

**Metrics:**
- CPU Usage (%)
- Memory Usage (%)
- Disk Space (%)
- Network I/O
- System Uptime
- Process Count

### 3. 🌿 **Git Neural Net**
Git repository visualization and management.

**Features:**
- Branch listing with status
- Recent commit history
- Repository statistics
- Branch comparison (ahead/behind)

### 4. 🔄 **Pipeline Matrix**
CI/CD pipeline simulation and monitoring.

**Stages:**
- Build & Test
- Security Scan
- Deploy to Production
- Real-time progress tracking

### 5. 🐳 **Container Grid**
Docker container management interface.

**Capabilities:**
- List all containers
- Start/Stop/Restart containers
- Resource usage monitoring
- Port mapping display

### 6. 🗄️ **Data Vault**
MongoDB Atlas database monitoring.

**Information:**
- Connection status
- Database statistics
- Collection details
- Storage metrics

## 💻 Terminal Commands

### ✅ **Allowed Commands (100+)**

#### **Basic System Commands**
```bash
ls              # List directory contents
pwd             # Print working directory
whoami          # Current user
date            # Current date/time
echo            # Display text
cat             # Display file contents
head            # Show first lines of file
tail            # Show last lines of file
```

#### **Git Commands**
```bash
git status      # Repository status
git branch      # List branches
git log         # Commit history
git init        # Initialize repository
git add .       # Stage all changes
git commit      # Create commit
git diff        # Show changes
git show        # Show commit details
```

#### **Docker Commands**
```bash
docker ps       # List running containers
docker ps -a    # List all containers
docker images   # List images
docker version  # Docker version
docker info     # Docker system info
docker stats    # Container statistics
docker logs     # Container logs
```

#### **Development Tools**
```bash
npm --version   # NPM version
node --version  # Node.js version
python --version # Python version
java -version   # Java version
code --version  # VS Code version
```

#### **System Information**
```bash
uname           # System information
hostname        # Computer name
uptime          # System uptime
df              # Disk usage
free            # Memory usage
ps              # Running processes
```

#### **Special Hacker Commands**
```bash
hack            # Initiate cyber attack simulation
matrix          # Enter the Matrix
nuke            # Launch nuclear codes (fake)
scan            # Network port scanner
exploit         # Show exploit framework
decrypt         # Decrypt intercepted data
trace           # Trace route to target
breach          # Security breach simulation
```

#### **Help Commands**
```bash
help            # Show basic help
commands        # List all available commands
```

### ❌ **Restricted Commands**

For security reasons, these commands are **NOT allowed**:

```bash
rm              # File deletion
del             # File deletion (Windows)
sudo            # Elevated privileges
su              # Switch user
chmod +x        # Make executable
wget http       # Download from internet
curl http       # HTTP requests to external sites
nc              # Netcat
eval            # Code evaluation
exec            # Code execution
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js 18+**
- **Docker Desktop**
- **Git**
- **MongoDB Atlas Account** (optional)

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd devops-workspace
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Setup**
Create `.env.local` file:
```env
# MongoDB Atlas (optional)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devops-workspace

# JWT Secret
JWT_SECRET=your-super-secret-key

# Environment
NODE_ENV=development
```

### 4. **Start Docker Desktop**
- Download and install Docker Desktop
- Start the application
- Wait for the whale icon to be steady

### 5. **Initialize Git Repository**
```bash
git init
git config user.name "DevOps User"
git config user.email "devops@example.com"
git add .
git commit -m "Initial commit"
```

### 6. **Create Sample Containers**
```bash
docker run hello-world
docker run -d --name test-nginx -p 8080:80 nginx
docker run -d --name test-redis redis:alpine
```

### 7. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## 🎯 How to Use Each Feature

### 🖥️ **Using the Terminal**

1. **Basic Commands:**
   ```bash
   ls                    # List files
   pwd                   # Current directory
   whoami               # Current user
   ```

2. **Git Operations:**
   ```bash
   git status           # Check repository status
   git add .            # Stage changes
   git commit -m "msg"  # Create commit
   git branch feature   # Create branch
   ```

3. **Docker Management:**
   ```bash
   docker ps            # List containers
   docker images        # List images
   docker stats         # Resource usage
   ```

4. **Hacker Commands:**
   ```bash
   hack                 # Cyber attack simulation
   matrix               # Matrix mode
   scan                 # Network scan
   ```

### 🌿 **Git Neural Net**

**To see branches and commits:**

1. **Initialize Git:**
   ```bash
   git init
   git config user.name "Your Name"
   git config user.email "your@email.com"
   ```

2. **Make First Commit:**
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

3. **Create Branches:**
   ```bash
   git branch feature/awesome-feature
   git branch develop
   git branch hotfix/bug-fix
   ```

4. **Make More Commits:**
   ```bash
   echo "# New Feature" > feature.md
   git add feature.md
   git commit -m "Add new feature"
   ```

### 🐳 **Container Grid**

**To populate with containers:**

1. **Create Test Containers:**
   ```bash
   docker run -d --name web-server -p 3001:80 nginx
   docker run -d --name database redis:alpine
   docker run -d --name api-server -p 3002:3000 node:alpine
   ```

2. **Manage Containers:**
   - Click **Start/Stop** buttons in the UI
   - View resource usage
   - Check port mappings

### 🔄 **Pipeline Matrix**

**Features:**
- Click **"RUN PIPELINE"** to start simulation
- Watch real-time progress bars
- View stage completion status
- Monitor build, security, and deploy phases

### 🗄️ **Data Vault**

**MongoDB Setup:**

1. **Create MongoDB Atlas Account**
2. **Create Cluster**
3. **Get Connection String**
4. **Add to `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devops-workspace
   ```

## 🎨 Customization

### **Adding New Commands**

Edit `app/api/terminal/execute/route.ts`:

```typescript
// Add to ALLOWED_COMMANDS array
const ALLOWED_COMMANDS = [
  // ... existing commands
  "your-new-command",
]

// Add command handler
if (trimmedCommand === "your-new-command") {
  return NextResponse.json({
    success: true,
    output: "Your command output here",
  })
}
```

### **Adding Sound Effects**

1. **Add audio files to `public/sounds/`**
2. **Update `hooks/use-sound.ts`**
3. **Use in components:**
   ```typescript
   const { playCustomSound } = useSound()
   playCustomSound()
   ```

### **Customizing UI Theme**

Edit `app/globals.css` for color schemes:

```css
:root {
  --cyber-green: #00ff41;
  --cyber-blue: #0080ff;
  --cyber-red: #ff0040;
}
```

## 🔮 Future Enhancements

### **Planned Features**
- [ ] **Real-time Collaboration** - Multi-user terminal sessions
- [ ] **Kubernetes Integration** - K8s cluster management
- [ ] **AWS/Azure Integration** - Cloud resource monitoring
- [ ] **Real Terminal Emulation** - Full shell access
- [ ] **Plugin System** - Custom command extensions
- [ ] **Themes** - Multiple cyberpunk color schemes
- [ ] **Mobile Support** - Responsive design improvements
- [ ] **WebSocket Real-time** - Live updates across all components

### **Advanced Integrations**
- [ ] **Jenkins Integration** - Real CI/CD pipeline connection
- [ ] **Prometheus Metrics** - Advanced monitoring
- [ ] **Grafana Dashboards** - Data visualization
- [ ] **Slack/Discord Notifications** - Alert integrations
- [ ] **JIRA Integration** - Issue tracking
- [ ] **GitHub Actions** - Workflow automation

## 🛠️ Troubleshooting

### **Common Issues**

#### **Git Issues**
```bash
# Problem: No branches showing
# Solution:
git init
git add .
git commit -m "Initial commit"

# Problem: Git commands fail
# Solution:
git config user.name "Your Name"
git config user.email "your@email.com"
```

#### **Docker Issues**
```bash
# Problem: No containers found
# Solution: Start Docker Desktop and create containers
docker run hello-world
docker run -d --name test-nginx nginx

# Problem: Permission denied
# Solution: Run Docker Desktop as administrator
```

#### **MongoDB Issues**
```bash
# Problem: Connection failed
# Solution: Check connection string in .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Problem: Access denied
# Solution: Check MongoDB Atlas user permissions
```

### **Debug Commands**
```bash
# Check Docker status
docker version
docker info

# Check Git status
git status
git log --oneline

# Check Node.js
node --version
npm --version
```

## 📊 Performance Metrics

### **System Requirements**
- **RAM:** 4GB minimum, 8GB recommended
- **CPU:** 2 cores minimum, 4 cores recommended
- **Storage:** 2GB free space
- **Network:** Broadband internet for MongoDB Atlas

### **Performance Features**
- **Lazy Loading** - Components load on demand
- **Caching** - API responses cached for performance
- **Debouncing** - Terminal input optimized
- **Virtual Scrolling** - Large lists optimized

## 🤝 Contributing

### **Development Setup**
```bash
git clone https://github.com/Slygriyrsk/devOps-workspace.git
cd devOps-workspace
npm install
npm run dev
```

### **Code Style**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for commit messages

### **Pull Request Process**
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **shadcn/ui** - Beautiful UI components
- **Docker** - Containerization platform
- **MongoDB** - Database solution
- **Vercel** - Deployment platform
- **Matrix Movie** - Inspiration for the cyberpunk theme

## 📞 Support

For support and questions:
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - General questions and ideas
- **Email** - Direct support contact

---

**Built with ❤️ by DevOps Engineers for DevOps Engineers**

*"Welcome to the Matrix of DevOps"* 🚀
