package analyze.filter;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import net.sf.json.JSONArray;

import analyze.DockingStream;
import analyze.attribute.AttributeDataType;

public class FileStructureChkFilter extends DockingFilter{

	
	public FileStructureChkFilter(DockingStream dockingStream) {
		super(dockingStream);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		this.getAttrSet().put(AttributeDataType.FILE_STRUCTURE, this.fileStructureChk(new File(this.getStream().getAttrSet().get(AttributeDataType.FILE_RESOURCE_PATH))));
	}

	private String fileStructureChk(File file) throws Exception {
		
		JSONArray jArr = new JSONArray();
		
		// 지금 데이터가 중복되어 추가되는 문제가 있음 고쳐야함

		if (file.isDirectory()) { 
			if (file.listFiles().length != 0) {
				File[] fileList = file.listFiles();
				for (int i = 0; i < fileList.length; i++) {
					fileStructureChk(fileList[i]);

					jArr.add(addFileInfo(fileList[i]));
				}
			}
			else {
				jArr.add(addFileInfo(file));
			}
		} 
		else {
			jArr.add(addFileInfo(file));
		}
		
		return jArr.toString();
	}

	@SuppressWarnings("resource")
	public String addFileInfo(File file) throws Exception
	{
		String name = null;
		String body = null;
		String type = null;
		String path = null;

		name = file.getName();
		path = file.getPath();
		path = path.replace("\\", "/");

		body = "";
		if(name.indexOf(".") != -1)
		{
			BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file),"UTF-8"));
			String rLine = null;
			while((rLine = br.readLine()) != null)
			{
				body += rLine;
			}
		}
		
		String[] info = {"name","body","type","path"};
		String[] data = {name,body,type,path};
		
		return this.jParseObj(info,data);
	}
}
