Shader "Custom/Lim Light"
{
    Properties
    {
        _RimPower ("RimPower", Range(1,10)) = 3
        [HDR]_RimColor ("RimColor", Color) = (1,1,1,1)
        _BumpMap ("NormalMap", 2D) = "bump"{}
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
    }
        SubShader
    {
        Tags { "RenderType" = "Opaque" }

        CGPROGRAM
        #pragma surface surf Lambert 

        float _RimPower;
        float4 _RimColor;
        sampler2D _BumpMap;
        sampler2D _MainTex;

        struct Input
        {
            float2 uv_BumpMap;
            float2 uv_MainTex;
            float3 viewDir;
        };

        void surf (Input IN, inout SurfaceOutput o)
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex);
            o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
            o.Albedo = c.rgb;
            float rim = saturate(dot(o.Normal, IN.viewDir));
            o.Emission = pow(1-rim, _RimPower)*_RimColor.rgb;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}
