package org.docking.erbse.file;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;

public class FileManager {
	
	public byte[] read(String src){

		File f = new File(src);

		byte[] data = null;
		try {
			data = this.getBytesFromFile(f);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return data;
	}

	public byte[] read(File src){
		return this.read(src.getPath());
	}

	public int write(String data, String destSrc){
		File file = null;

		file = new File(destSrc);

		try {
			file.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		}

		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new FileWriter(file));
			bw.write(data);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			return 0;
		}

		return 1;
	}

	public int delete(String src){

		this.delFile(new File(src));
		return 1;
	}

	public String extensionChk(File src){
		return this.extensionChk(src.getPath());
	}

	public String extensionChk(String src){

		String res = null;
		int len = src.lastIndexOf(".");

		if(len > 0){
			res = src.substring(len+1,src.length());
		}

		return res;
	}
	
	public String fileNameChk(File src){
		return this.fileNameChk(src.getName());
	}
	
	public String fileNameChk(String src){
		String res = null;
		int len = src.lastIndexOf(".");
		
		if(len > 0){
			res = src.substring(0,len+1);
		}
		return res;
	}
	
	public int zip(String src){
		return this.zip(new File(src));
	}

	public int zip(File src){
		return this.zip(src, src.getParentFile());
	}

	public int zip(File src, File destSrc){
		return this.zip(src, destSrc, true);
	}
	
	public int zip(String src, boolean rootDir){
		return this.zip(new File(src), rootDir);
	}

	public int zip(File src, boolean rootDir){
		return this.zip(src, src.getParentFile(), true);
	}

	public int zip(File src, File destSrc, boolean rootDir){

		String fName = delFileNameExtension(src);
		byte[] buf = new byte[8 * 1024];

		// 압축파일 저장될 폴더생성
		new File(destSrc.getPath()).mkdir();

		fName = fName.concat(".zip");

		File zipFile = new File (destSrc, fName);
		if(!zipFile.exists()){
			try {
				zipFile.createNewFile();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		ZipArchiveEntry zae;
		ZipArchiveOutputStream zaos;
		try {
			zaos = new ZipArchiveOutputStream(new FileOutputStream(zipFile));
			zaos.setEncoding("UTF-8");
			FileInputStream fis;
			int len;

			Stack<File> stack = new Stack<File>();
			File root;

			if(src.isDirectory()){
				if(rootDir){
					stack.push(src);
					root = src.getParentFile();
				}
				else{
					File[] fList = src.listFiles();
					for (int i = 0; i < fList.length; i++) {
						stack.push(fList[i]);
					}
					root = src;
				}
			}
			else{
				stack.push(src);
				root = src.getParentFile();
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

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		}

		return 1;
	}

	public int unZip(String src){
		String dat = null;
		int len = src.lastIndexOf(".");

		if(len > 0){
			dat = src.substring(0,len+1);
		}

		return this.unZip(src,dat);
	}

	public int unZip(String src, String destSrc){

		InputStream is = null;
		int res = 0;
		byte[] buf = new byte[8 * 1024];

		try {
			is = new FileInputStream(new File(src));
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		ZipArchiveInputStream zais = new ZipArchiveInputStream(is, "UTF-8");
		ZipArchiveEntry zae = null;
		File newFile = null;
		BufferedOutputStream bos = null;

		int written = 0;

		try {
			while((zae = zais.getNextZipEntry()) != null)
			{
				newFile = new File(destSrc, zae.getName());

				mkParentDir(newFile);

				if (zae.isDirectory()){
					newFile.mkdir();
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
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		}

		return 1;
	}
	
	public File[] fileStructureChk(String src) throws IOException {
		return this.fileStructureChk(new File(src));
	}

	public File[] fileStructureChk(File file) throws IOException {

		List<File> list = new ArrayList<File>();

		if (file.isDirectory()) {   
			if (file.listFiles().length != 0) {
				File[] fileList = file.listFiles();
				for (int i = 0; i < fileList.length; i++) {
					fileStructureChk(fileList[i]);

					list.add(fileList[i]);
				}
			}
			else {
				list.add(file);
			}
		} else {
			list.add(file);
		}
		File[] files = new File[list.size()];
		list.toArray(files);

		return files;
	}

	private byte[] getBytesFromFile(File file) throws IOException {

		InputStream is = new FileInputStream(file);

		long length = file.length();

		if(length > Integer.MAX_VALUE) {
			// Error message..
		}

		byte[] bytes = new byte[(int) length];

		int offset = 0;
		int numRead = 0;

		while(offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) { 
			offset += numRead;
		}

		if(offset < bytes.length) {
			throw new IOException("IOException : " + file.getPath());
		}
		is.close();

		return bytes;
	}

	private void mkParentDir(File file) {
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
			if(prnDir[i].getParent() != null){
				prnDir[i].mkdir();
			}
		}
	}

	private void delFile(File file) {
		File[] files = file.listFiles();
		if(files == null){
			file.delete();
		}
		else{
			for(int i=0; i< files.length;i++){
				if(files[i].isFile()){
					files[i].delete();
					continue;
				}
				if(files[i].isDirectory()){
					delFile(files[i]);
				}
				files[i].delete();
			}
			file.delete();
		}
	}

	private String delFileNameExtension(File file) {

		String name = file.getName();
		if(!file.isDirectory()){
			int fLen = name.lastIndexOf(".");   // file name length
			if(fLen > 0){
				name = name.substring(0,fLen);   // 확장자 제거
			}
		}

		return name;
	}
}