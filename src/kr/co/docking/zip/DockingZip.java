package kr.co.docking.zip;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Stack;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;

public class DockingZip {
	private String encoding;
	public static byte[] buf = new byte[8 * 1024];

	public DockingZip() {
		this.encoding = "UTF-8";
	}
	
	public DockingZip(String encoding) {
		this.encoding = encoding;
	}
	
	public String getEncoding() {
		return encoding;
	}

	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}
	
	public void zip(File srcFile) throws IOException {
		this.zip(srcFile, srcFile.getParentFile());
	}
	
	public void zip(File srcFile, File destDir) throws IOException {
		this.zip(srcFile, destDir, true);
	}
	
	public void zip(File srcFile, boolean rootDir) throws IOException {
		this.zip(srcFile, srcFile.getParentFile(), true);
	}
	
	public void zip(File srcFile, File destDir, boolean rootDir) throws IOException {
		String fName = delFileNameExtension(srcFile);

		// 압축파일 저장될 폴더생성
		mkDir(destDir.getPath());

		fName = fName.concat(".zip");

		File zipFile = new File (destDir, fName);
		if(!zipFile.exists()){
			zipFile.createNewFile();
		}

		ZipArchiveEntry zae;
		ZipArchiveOutputStream zaos = new ZipArchiveOutputStream(new FileOutputStream(zipFile));
		zaos.setEncoding(encoding);

		FileInputStream fis;
		int len;

		Stack<File> stack = new Stack<File>();
		File root;

		if(srcFile.isDirectory()){
			if(rootDir){
				stack.push(srcFile);
				root = srcFile.getParentFile();
			}
			else{
				File[] fList = srcFile.listFiles();
				for (int i = 0; i < fList.length; i++) {
					stack.push(fList[i]);
				}
				root = srcFile;
			}
		}
		else{
			stack.push(srcFile);
			root = srcFile.getParentFile();
		}

		while ( !stack.isEmpty() ){
			File f = stack.pop();

			String zipPath = f.getAbsolutePath();

			zipPath = zipPath.substring(root.getAbsolutePath().length());

			if(zipPath.startsWith("/")){
				zipPath = zipPath.substring(1);
			}
			if(f.isDirectory() && !zipPath.endsWith("/")){
				zipPath += "/" ;
			}

			if(f.isDirectory()){
				File [] fs = f.listFiles();
				for (int i = 0; i < fs.length; i++) {
					if(fs[i].isDirectory()) 
						stack.push(fs[i]);
					else 
						stack.add(0, fs[i]);
				}
			} 
			else{
				zae = new ZipArchiveEntry(zipPath);
				zaos.putArchiveEntry(zae);
				fis = new FileInputStream(f);

				while ((len = fis.read(buf, 0, buf.length)) >= 0 ){
					zaos.write(buf, 0, len);
				}

				fis.close();
				zaos.closeArchiveEntry();
			}
		}
		zaos.close();
	}
	
	public void unZip(File srcFile) throws FileNotFoundException, IOException {
		this.unZip(srcFile, srcFile.getParentFile());
	}
	
	public void unZip(File srcFile, File destDir) throws FileNotFoundException, IOException {
		this.unZip(new FileInputStream(srcFile), destDir);
	}

	public void unZip(InputStream srcFile, File destDir) throws FileNotFoundException, IOException {

		ZipArchiveInputStream zais = new ZipArchiveInputStream(srcFile, encoding);
		ZipArchiveEntry zae = null;
		File newFile = null;
		BufferedOutputStream bos = null;
		
		int written = 0;

		while((zae = zais.getNextZipEntry()) != null)
		{
			newFile = new File(destDir, zae.getName());

			mkParentDir(newFile);

			if (zae.isDirectory()){
				mkDir(newFile);
			} 
			else{
				newFile.createNewFile();

				bos = new BufferedOutputStream(new FileOutputStream(newFile));
				while ((written = zais.read(buf)) >= 0 ){
					bos.write(buf, 0, written);
				}
				bos.close();
			}
		}
		zais.close();
	}

	public String delFileNameExtension(File file) {

		String name = file.getName();
		if(!file.isDirectory()){
			int fLen = name.lastIndexOf(".");	// file name length
			if(fLen > 0){
				name = name.substring(0,fLen);	// 확장자 제거
			}
		}

		return name;
	}

	public void mkParentDir(File file) {
		File parentDir = file;
		int prnDirCnt = parentDir.getParent().split("\\\\").length;
		File[] prnDir = new File[prnDirCnt];

		for(int i=0;i<prnDirCnt;i++)
		{
			prnDir[i] = parentDir.getParentFile();
			parentDir = parentDir.getParentFile();
		}

		for(int i=prnDirCnt-1;i>=0;i--)
		{
			// 루트 폴더 구하는거 추가해도 될듯
				mkDir(prnDir[i]);
		}
	}

	public void mkDir(String destDir) {
		mkDir(new File(destDir));
	}

	public void mkDir(File destDir) {
		destDir.mkdir();
	}
}
