export default function getInitials(name: string): string {
    const nameArray = name.trim().split(' ');
    if (nameArray.length === 1) {
        return `${nameArray[0].trim().charAt(0)}`;
    }
    return `${nameArray[0].charAt(0)}${nameArray[nameArray.length - 1].trim().charAt(0)}`;
}