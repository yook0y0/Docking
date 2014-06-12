package analyze.filter;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

import analyze.DockingAnalyzer;
import analyze.attribute.AttributeDataType;

public class ReroutingFilter extends DockingFilter {
	
	public static String SERVER_ROUTING = "src=\"./srcLoad?file=";

	public ReroutingFilter(DockingAnalyzer da) {
		super(da);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		this.getAttrSet().put(AttributeDataType.FILE_STRUCTURE, this.rerouting(new File(this.getStream().getAttrSet().get(AttributeDataType.FILE_RESOURCE_PATH))));
	}
	
	@SuppressWarnings("resource")
	private String rerouting(File file) throws IOException
	{	
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file),"UTF-8"));
		String rLine = null;
		String body = "";
		
		System.out.println(br.toString());
		while((rLine = br.readLine()) != null)
		{
			System.out.println(rLine);
			// body �ъ꽕��遺�텇���ㅼ떆 怨좎퀜�쇳븷 �꾩슂媛��덉쓬
			body += rLine.replace("src=\"" + "./", SERVER_ROUTING);
			body += "\n";
		}
		System.out.println(body);
		
		BufferedWriter bw = new BufferedWriter(new FileWriter(file));
		
		bw.write(body);
		bw.close();
		
		return body;
	}
}
